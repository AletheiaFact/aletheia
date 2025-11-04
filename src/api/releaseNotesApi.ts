import axios from "axios";
import { MessageManager } from "../components/Messages";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/release-notes`,
});

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

const getLatestReleases = (limit: number = 10): Promise<GitHubRelease[]> => {
    console.log('first on the first', limit)
    return request
        .get(`/`, {
            params: { limit },
        })
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            MessageManager.showMessage(
                "error",
                err.response?.data?.message || "Failed to fetch release notes"
            );
            throw err;
        });
};

const getReleaseByTag = (tag: string): Promise<GitHubRelease> => {
    return request
        .get(`/${tag}`)
        .then((response) => {
            return response.data;
        })
        .catch((err) => {
            MessageManager.showMessage(
                "error",
                err.response?.data?.message || "Failed to fetch release"
            );
            throw err;
        });
};

const ReleaseNotesApi = {
    getLatestReleases,
    getReleaseByTag,
};

export default ReleaseNotesApi;
