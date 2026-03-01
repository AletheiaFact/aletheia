import { Injectable, Logger } from "@nestjs/common";
import { SourceService } from "../source/source.service";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";

/**
 * Normalized source format used throughout the copilot module.
 *
 * Agencia returns sources in two formats depending on search type:
 * - Web search: objects like { url: "https://...", title: "Page Title", type: "web_search" }
 * - Gazette search: plain strings like "Porto Alegre (2024-06-11): https://..."
 *
 * Both are normalized to this interface for downstream processing.
 */
export interface AgenciaSource {
    url?: string;
    href?: string;
    title?: string;
    type?: string;
    props?: Record<string, any>;
}

// Matches http:// or https:// URLs in a string
const URL_REGEX = /https?:\/\/[^\s,)}\]]+/i;

@Injectable()
export class CopilotSourceService {
    private readonly logger = new Logger("CopilotSourceService");

    constructor(private readonly sourceService: SourceService) {}

    /**
     * Parses a plain-string source into a normalized AgenciaSource object.
     *
     * Gazette search returns sources like:
     *   "Porto Alegre (2024-06-11): https://data.queridodiario.ok.org.br/..."
     *   "PDF da Lei nº 13.947/2024: http://dopaonlineupload.procempa.com.br/..."
     *
     * Extracts the URL and uses the remaining text as the title.
     */
    private parseStringSource(source: string): AgenciaSource | null {
        const match = source.match(URL_REGEX);
        if (!match) {
            return null;
        }

        const href = match[0];
        // Everything before the URL becomes the title (trimmed of trailing separators)
        const title = source
            .substring(0, match.index)
            .replace(/[:\s]+$/, "")
            .trim();

        return {
            href,
            title: title || href,
            type: "gazette",
        };
    }

    /**
     * Normalizes a single source entry (string or object) into an AgenciaSource.
     * Returns null if no valid URL can be extracted.
     */
    private normalizeSource(source: string | AgenciaSource): AgenciaSource | null {
        if (typeof source === "string") {
            return this.parseStringSource(source);
        }

        const sourceHref = source.href || source.url;
        if (!sourceHref) {
            return null;
        }

        return { ...source, href: sourceHref };
    }

    /**
     * Processes sources returned by Agencia and persists them as Source documents.
     *
     * Handles both formats returned by Agencia:
     * - Plain strings (gazette search): parsed to extract URL and description
     * - Objects with url/href (web search): normalized to use `href`
     *
     * For each source:
     * - Normalizes to AgenciaSource with `href` field
     * - Validates and deduplicates via SourceService.create() (md5 hash of href)
     * - Stores Agencia metadata (title, type) in the Source `props` field
     * - Gracefully skips invalid URLs or sources without extractable URL
     * - Returns normalized sources array for downstream use
     *
     * @param sources - Array of sources from Agencia (strings or objects)
     * @param userId - The ID of the user who initiated the copilot session
     * @param nameSpace - Optional namespace (defaults to Main)
     * @returns Normalized sources array with `href` field
     */
    async processAgenciaSources(
        sources: (string | AgenciaSource)[],
        userId: string,
        nameSpace: string = NameSpaceEnum.Main
    ): Promise<AgenciaSource[]> {
        if (!sources || sources.length === 0) {
            return [];
        }

        const normalizedSources: AgenciaSource[] = [];

        for (const source of sources) {
            const normalized = this.normalizeSource(source);

            if (!normalized?.href) {
                this.logger.warn(
                    `Skipping Agencia source without extractable URL: ${
                        typeof source === "string"
                            ? source.substring(0, 80)
                            : JSON.stringify(source)
                    }`
                );
                continue;
            }

            normalizedSources.push(normalized);

            try {
                await this.sourceService.create({
                    href: normalized.href,
                    user: userId,
                    nameSpace,
                    props: {
                        ...(normalized.props || {}),
                        title: normalized.title,
                        type: normalized.type,
                    },
                });

                this.logger.log(
                    `Persisted Agencia source: ${normalized.href}`
                );
            } catch (error) {
                this.logger.warn(
                    `Failed to process Agencia source ${normalized.href}: ${error.message}`
                );
            }
        }

        return normalizedSources;
    }
}
