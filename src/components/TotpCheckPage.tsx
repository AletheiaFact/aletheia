import React, { useEffect } from "react";
import { useAtom } from "jotai";
import { currentAuthentication, currentUserId } from "../atoms/currentUser";
import userApi from "../api/userApi";
import { currentNameSpace } from "../atoms/namespace";
import { NameSpaceEnum } from "../types/Namespace";
import { useTranslations } from "next-intl";

const AalCheckPage = () => {
    const tCheckAal = useTranslations("checkAal");
    const [nameSpace] = useAtom(currentNameSpace);

    const [aal] = useAtom(currentAuthentication);
    const [userId] = useAtom(currentUserId);

    const aal2Activated = aal === "aal2";

    const userDataUpdate = async () => {
        try {
            await userApi.updateTotp(userId, { totp: true });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (aal2Activated) {
            userDataUpdate();
        }
    }, [aal]);

    return (
        <div
            style={{
                width: "100%",
                marginTop: "60px",
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: 600,
            }}
        >
            <div>{tCheckAal("informationUpdated")}</div>
            <a
                href={nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "/"}
                style={{
                    height: "60px",
                    fontSize: "1rem",
                    placeContent: "center",
                }}
            >
                {tCheckAal("goBack")}
            </a>
        </div>
    );
};

export default AalCheckPage;
