import {
    Controller,
    Get,
    Header,
    Logger,
    Query,
    Req,
    Res,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClaimRevisionService } from "../claim/claim-revision/claim-revision.service";
import { IsPublic } from "../auth/decorators/is-public.decorator";
import { PersonalityService } from "../personality/personality.service";
import { SentenceService } from "../claim/types/sentence/sentence.service";
import { ViewService } from "../view/view.service";
import { parse } from "url";
import { Response } from "express";
import { BaseRequest } from "../types";

@Controller()
export class SearchController {
    private readonly logger = new Logger("SearchController");
    constructor(
        private viewService: ViewService,
        private personalityService: PersonalityService,
        private sentenceService: SentenceService,
        private claimRevisionService: ClaimRevisionService,
        private configService: ConfigService
    ) {}

    @IsPublic()
    @Get("search")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    public async showSearchPage(
        @Req() req: BaseRequest,
        @Res() res: Response,
        @Query("searchText") searchText: string,
        @Query("pageSize") pageSize: number
    ) {
        const parsedUrl = parse(req.url, true);

        let searchResults;
        if (this.configService.get<string>("db.atlas") && searchText) {
            searchResults = await Promise.all([
                this.personalityService.findAll(
                    searchText,
                    pageSize,
                    req.language
                ),
                this.sentenceService.findAll(searchText, pageSize),
                this.claimRevisionService.findAll(searchText, pageSize),
            ])
                .then(([personalities, sentences, claims]) => {
                    return {
                        personalities,
                        sentences,
                        claims,
                    };
                })
                .catch((error) => this.logger.error(error));
        } else if (searchText) {
            searchResults = await this.personalityService.combinedListAll({
                name: searchText,
                pageSize,
                language: req.language,
            });
        }

        await this.viewService.getNextServer().render(
            req,
            res,
            "/search-page",
            Object.assign(parsedUrl.query, {
                searchResults,
            })
        );
    }

    @IsPublic()
    @Get("api/results")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    async listAll(@Query() query, @Req() req) {
        const { pageSize, searchText } = query;

        if (this.configService.get<string>("db.atlas")) {
            return Promise.all([
                this.personalityService.findAll(
                    searchText,
                    pageSize,
                    req.language
                ),
                this.sentenceService.findAll(searchText, pageSize),
                this.claimRevisionService.findAll(searchText, pageSize),
            ])
                .then(([personalities, sentences, claims]) => {
                    return {
                        personalities,
                        sentences,
                        claims,
                    };
                })
                .catch((error) => this.logger.error(error));
        } else {
            return this.personalityService.combinedListAll({
                name: searchText,
                pageSize,
                language: req.language,
            });
        }
    }
}
