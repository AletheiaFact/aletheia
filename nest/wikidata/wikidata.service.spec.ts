import { Test, TestingModule } from "@nestjs/testing";
import { WikidataService } from "./wikidata.service";

describe("WikidataService", () => {
    let service: WikidataService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [WikidataService],
        }).compile();

        service = module.get<WikidataService>(WikidataService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
