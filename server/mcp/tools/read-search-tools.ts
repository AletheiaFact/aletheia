import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { assertNamespaceAccess, jsonResult, safeTool } from "./tool-helpers";
import { SearchSchema, SearchTopicsSchema } from "./schemas";
import type { McpToolDeps } from "../mcp.service";
import {
    CLASSIFICATION_LABELS_NOTE as LABELS_NOTE,
    withClassificationLabels,
} from "./classification-labels";

export function registerReadSearchTools(server: McpServer, deps: McpToolDeps) {
    server.registerTool(
        "search",
        {
            description:
                "Full-text search across personalities, claim sentences and claim revisions." +
                LABELS_NOTE,
            inputSchema: SearchSchema.shape as any,
        },
        safeTool("search", async (args) => {
            const { searchText, pageSize, language, nameSpace } = args;
            await assertNamespaceAccess(
                deps.nameSpaceService,
                deps.request.user,
                nameSpace
            );
            if (deps.configService.get("db.atlas")) {
                const [personalities, sentences, claims] = await Promise.all([
                    deps.personalityService.findAll({
                        searchText,
                        pageSize,
                        language,
                        nameSpace,
                    }),
                    deps.sentenceService.findAll({
                        searchText,
                        pageSize,
                        nameSpace,
                    }),
                    deps.claimRevisionService.findAll({
                        searchText,
                        pageSize,
                        nameSpace,
                    }),
                ]);
                return jsonResult(
                    withClassificationLabels({
                        personalities: personalities.processedPersonalities,
                        sentences: sentences.processedSentences,
                        claims: claims.processedRevisions,
                    })
                );
            }
            const fallback = await deps.personalityService.combinedListAll({
                name: searchText,
                pageSize,
                language,
            });
            return jsonResult(withClassificationLabels(fallback));
        })
    );

    server.registerTool(
        "search_topics",
        {
            description: "Search topics by name or alias",
            inputSchema: SearchTopicsSchema.shape as any,
        },
        safeTool("search_topics", async (args) =>
            jsonResult(
                await deps.topicService.searchTopics(args.query, args.language)
            )
        )
    );
}
