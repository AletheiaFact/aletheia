import { Controller, Get, Param, Query, Response } from "@nestjs/common";
import { WikidataService } from "./wikidata.service";

@Controller("wikidata")
export class WikidataController {
    constructor(private readonly wikidataService: WikidataService) {}

    @Get(":wikidataId")
    async getWikidata(
        @Param() params,
        @Query() query,
        @Response() res
    ): Promise<any> {
        console.log("params", params);
        console.log("query", query);
        this.wikidataService
            .fetchProperties({ ...params, ...query })
            .then((props) => {
                res.send({ ...props });
            });
    }
}
