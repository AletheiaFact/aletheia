import { Test, TestingModule } from "@nestjs/testing";
import { WikidataController } from "./wikidata.controller";

describe("WikidataController", () => {
    let controller: WikidataController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WikidataController],
        }).compile();

        controller = module.get<WikidataController>(WikidataController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
