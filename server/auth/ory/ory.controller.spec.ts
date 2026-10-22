import OryController, { hasOrySessionCredentials } from "./ory.controller";

const makeReq = (headers: Record<string, string> = {}) => ({ headers } as any);

const makeRes = () => {
    const res: any = {};
    res.setHeader = vi.fn().mockReturnValue(res);
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};

describe("hasOrySessionCredentials", () => {
    it("is false without cookies or a session token", () => {
        expect(hasOrySessionCredentials(makeReq())).toBe(false);
    });

    it("is false when only unrelated cookies are present", () => {
        expect(
            hasOrySessionCredentials(
                makeReq({ cookie: "default_language=pt; csrf_token_abc=1" })
            )
        ).toBe(false);
    });

    it("is true for an Ory Cloud session cookie", () => {
        expect(
            hasOrySessionCredentials(
                makeReq({
                    cookie: "default_language=pt; ory_session_aletheia=xyz",
                })
            )
        ).toBe(true);
    });

    it("is true for a self-hosted Kratos session cookie", () => {
        expect(
            hasOrySessionCredentials(
                makeReq({ cookie: "ory_kratos_session=xyz" })
            )
        ).toBe(true);
    });

    it("is true for a native-app session token", () => {
        expect(
            hasOrySessionCredentials(
                makeReq({ "x-session-token": "ory_st_abc" })
            )
        ).toBe(true);
    });
});

describe("OryController.whoAmI", () => {
    const whoAmI = vi.fn();
    const controller = new OryController({} as any, { whoAmI } as any);

    beforeEach(() => whoAmI.mockReset());

    it("answers an anonymous request with 401 without calling Ory", async () => {
        const res = makeRes();
        await controller.whoAmI(
            makeReq({ cookie: "default_language=pt" }),
            res
        );

        expect(whoAmI).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.setHeader).toHaveBeenCalledWith(
            "Cache-Control",
            "public, max-age=0, s-maxage=60"
        );
    });

    it("forwards the cookies to Ory when a session cookie is present", async () => {
        const session = { id: "session-1" };
        whoAmI.mockResolvedValue(session);
        const res = makeRes();
        const cookie = "ory_session_aletheia=xyz";

        await controller.whoAmI(makeReq({ cookie }), res);

        expect(whoAmI).toHaveBeenCalledWith(cookie);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(session);
        expect(res.setHeader).not.toHaveBeenCalled();
    });

    it("keeps calling Ory for a native-app session token", async () => {
        whoAmI.mockResolvedValue({ id: "session-2" });
        const res = makeRes();

        await controller.whoAmI(
            makeReq({ "x-session-token": "ory_st_abc" }),
            res
        );

        expect(whoAmI).toHaveBeenCalled();
    });
});
