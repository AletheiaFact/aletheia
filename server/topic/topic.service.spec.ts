import { TopicService } from "./topic.service";
import { IMPACT_AREAS } from "./constants/impact-areas";

describe("TopicService (Unit)", () => {
    let service: TopicService;

    beforeEach(() => {
        // Request-scoped provider: instantiated directly, deps are unused
        service = new TopicService(
            {} as any,
            {} as any,
            {} as any,
            {} as any
        );
    });

    describe("getImpactAreas", () => {
        it("returns the name and slug of every area in the closed list", () => {
            expect(service.getImpactAreas()).toEqual(
                IMPACT_AREAS.map(({ name, slug }) => ({ name, slug }))
            );
        });
    });
});
