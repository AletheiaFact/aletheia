import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

export interface GitHubRelease {
    id: number;
    tag_name: string;
    name: string;
    body: string;
    published_at: string;
    html_url: string;
    prerelease: boolean;
    draft: boolean;
}

@Injectable()
export class ReleaseNotesService {
    private readonly logger = new Logger(ReleaseNotesService.name);
    private readonly githubRepo = "AletheiaFact/aletheia";
    private readonly githubApiUrl = `https://api.github.com/repos/${this.githubRepo}/releases`;

    constructor(private readonly httpService: HttpService) {}

    async getLatestReleases(limit: number = 10): Promise<GitHubRelease[]> {
        try {

            console.log('on release note')

            const response = await firstValueFrom(
                this.httpService.get<GitHubRelease[]>(this.githubApiUrl, {
                    params: {
                        per_page: limit,
                        page: 1,
                    },
                    headers: {
                        Accept: "application/vnd.github.v3+json",
                        "User-Agent": "Aletheia-App",
                    },
                })
            );

            // Filter out drafts and prereleases
            return response.data.filter(
                (release) => !release.draft && !release.prerelease
            );
        } catch (error) {
            this.logger.error(
                `Error fetching GitHub releases: ${error.message}`,
                error.stack
            );
            return [];
        }
    }

    async getReleaseByTag(tag: string): Promise<GitHubRelease | null> {
        try {
            const response = await firstValueFrom(
                this.httpService.get<GitHubRelease>(
                    `${this.githubApiUrl}/tags/${tag}`,
                    {
                        headers: {
                            Accept: "application/vnd.github.v3+json",
                            "User-Agent": "Aletheia-App",
                        },
                    }
                )
            );

            return response.data;
        } catch (error) {
            this.logger.error(
                `Error fetching GitHub release ${tag}: ${error.message}`,
                error.stack
            );
            return null;
        }
    }
}
