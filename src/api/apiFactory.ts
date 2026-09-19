import axios, { AxiosInstance } from "axios";
import { sessionExpiredManager } from "../components/SessionExpiredModal";

let isRedirecting = false;

function isRelativePath(url: string): boolean {
    return !url.startsWith("http") && !url.startsWith("//") && !url.includes("://");
}

export function createApiInstance(baseURL: string): AxiosInstance {
    const instance = axios.create({
        withCredentials: true,
        baseURL,
    });

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            const status = error.response?.status;

            if (status === 401) {
                const currentPath = window.location.pathname;
                if (
                    currentPath !== "/login" &&
                    currentPath !== "/registration"
                ) {
                    if (!isRedirecting) {
                        isRedirecting = true;

                        const returnTo = window.location.pathname + window.location.search;
                        const safeReturnTo = isRelativePath(returnTo) ? returnTo : "/";

                        sessionExpiredManager.trigger(safeReturnTo);
                    }

                    // Suppress downstream .catch() handlers to prevent
                    // generic error toasts from appearing alongside the modal.
                    return new Promise(() => {});
                }
            }

            return Promise.reject(error);
        }
    );

    return instance;
}
