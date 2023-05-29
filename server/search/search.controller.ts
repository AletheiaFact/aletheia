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
        @Query("pageSize") pageSize: number,
        @Query("page") page: number,
        @Query("filter") filter: string | Array<string>
    ) {
        try {
            const parsedUrl = parse(req.url, true);
            let searchResults;
            if (this.configService.get<string>("db.atlas")) {
                //This is necessary cause the page and pageSize logic is applied to 3 different collections
                const processedPageSize = Math.ceil((pageSize || 10) / 3);
                const skipedDocuments =
                    page > 1 ? processedPageSize * (page - 1) : 0;

                const [personalities, sentences, claims] = await Promise.all([
                    searchText
                        ? this.personalityService.findAll(
                              searchText,
                              processedPageSize,
                              req.language,
                              skipedDocuments
                          )
                        : Promise.resolve(undefined),
                    searchText || filter
                        ? this.sentenceService.findAll(
                              searchText,
                              processedPageSize,
                              skipedDocuments,
                              filter
                          )
                        : Promise.resolve(undefined),
                    searchText
                        ? this.claimRevisionService.findAll(
                              searchText,
                              processedPageSize,
                              skipedDocuments
                          )
                        : Promise.resolve(undefined),
                ]);

                const totalPersonalities = personalities?.totalRows || 0;
                const totalSentences = sentences?.totalRows || 0;
                const totalClaims = claims?.totalRows || 0;

                const totalResults =
                    totalPersonalities + totalSentences + totalClaims;
                const totalPages = Math.max(
                    Math.ceil(totalPersonalities / processedPageSize) || 0,
                    Math.ceil(totalSentences / processedPageSize) || 0,
                    Math.ceil(totalClaims / processedPageSize) || 0
                );

                searchResults = {
                    personalities: personalities?.processedPersonalities,
                    sentences: sentences?.processedSentences,
                    claims: claims?.processedRevisions,
                    totalResults,
                    totalPages,
                };
            } else if (searchText) {
                //TODO: Create Search Logic for Local Usage
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
                    searchText,
                    pageSize,
                    page,
                    filter,
                })
            );
        } catch (error) {
            this.logger.error(error);
            res.status(500).json({ error: "An error occurred" });
        }
    }

    @IsPublic()
    @Get("api/search")
    @Header("Cache-Control", "max-age=60, must-revalidate")
    async listAll(@Query() query, @Req() req) {
        const { pageSize, searchText } = query;
        const parsedPageSize = parseInt(pageSize, 10);

        if (this.configService.get<string>("db.atlas")) {
            return await Promise.all([
                this.personalityService.findAll(
                    searchText,
                    parsedPageSize,
                    req.language,
                    null
                ),
                this.sentenceService.findAll(
                    searchText,
                    parsedPageSize,
                    null,
                    null
                ),
                this.claimRevisionService.findAll(
                    searchText,
                    parsedPageSize,
                    null
                ),
            ])
                .then(([personalities, sentences, claims]) => {
                    return {
                        personalities: personalities.processedPersonalities,
                        sentences: sentences.processedSentences,
                        claims: claims.processedRevisions,
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
