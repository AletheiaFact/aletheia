import { Injectable, Logger } from "@nestjs/common";
import { SourceService } from "../source/source.service";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";

/**
 * Agencia returns sources with `url` (not `href`), plus `title` and `type`.
 * Example: { url: "https://...", title: "Page Title", type: "web_search" }
 */
export interface AgenciaSource {
    url?: string;
    href?: string;
    title?: string;
    type?: string;
    props?: Record<string, any>;
}

@Injectable()
export class CopilotSourceService {
    private readonly logger = new Logger("CopilotSourceService");

    constructor(private readonly sourceService: SourceService) {}

    /**
     * Processes sources returned by Agencia and persists them as Source documents.
     *
     * Agencia sources use `url` field (not `href`), so we normalize to `href`
     * for compatibility with the Source schema and editor-parser.
     *
     * For each source:
     * - Normalizes `url` → `href`
     * - Validates and deduplicates via SourceService.create() (md5 hash of href)
     * - Stores Agencia metadata (title, type) in the Source `props` field
     * - Gracefully skips invalid URLs or sources without url/href
     * - Returns normalized sources array (with `href` field) for schema2editor
     *
     * @param sources - Array of sources from Agencia's response
     * @param userId - The ID of the user who initiated the copilot session
     * @param nameSpace - Optional namespace (defaults to Main)
     * @returns Normalized sources array with `href` field added
     */
    async processAgenciaSources(
        sources: AgenciaSource[],
        userId: string,
        nameSpace: string = NameSpaceEnum.Main
    ): Promise<AgenciaSource[]> {
        if (!sources || sources.length === 0) {
            return [];
        }

        const normalizedSources: AgenciaSource[] = [];

        for (const source of sources) {
            // Agencia uses `url`, Source schema uses `href` — normalize
            const sourceHref = source.href || source.url;

            if (!sourceHref) {
                this.logger.warn(
                    "Skipping Agencia source without url/href"
                );
                continue;
            }

            // Build the normalized source with `href` for schema2editor
            const normalized: AgenciaSource = {
                ...source,
                href: sourceHref,
            };
            normalizedSources.push(normalized);

            try {
                await this.sourceService.create({
                    href: sourceHref,
                    user: userId,
                    nameSpace,
                    props: {
                        ...(source.props || {}),
                        title: source.title,
                        type: source.type,
                    },
                });

                this.logger.log(
                    `Persisted Agencia source: ${sourceHref}`
                );
            } catch (error) {
                this.logger.warn(
                    `Failed to process Agencia source ${sourceHref}: ${error.message}`
                );
            }
        }

        return normalizedSources;
    }
}
