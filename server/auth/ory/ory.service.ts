import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Roles } from "../../auth/ability/ability.factory";

@Injectable()
export default class OryService {
    private adminUrl: string;
    private url: string;
    private app_affiliation: string;

    constructor(private configService: ConfigService) {
        const { admin_url, admin_endpoint, url } =
            this.configService.get("ory");
        this.url = url;
        this.adminUrl = `${admin_url}/${admin_endpoint}`;
        this.app_affiliation = this.configService.get<string>("app_affiliation");
    }

    private getHeaders(includeAuth = true): HeadersInit {
        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        
        if (includeAuth) {
            const { access_token: token } = this.configService.get("ory");
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }
        }
        
        return headers;
    }

    async updateIdentity(
        user,
        password,
        traits?: { role?: any }
    ): Promise<any> {
        const { schema_id } = this.configService.get("ory");
        const credentials = password
            ? {
                  password: {
                      config: { password },
                  },
              }
            : {};
        return fetch(`${this.adminUrl}/identities/${user.oryId}`, {
            method: "put",
            body: JSON.stringify({
                schema_id,
                traits: {
                    email: user.email,
                    user_id: user._id,
                    app_affiliation: this.app_affiliation,
                    ...traits,
                },
                credentials,
            }),
            headers: {
                ...this.getHeaders(),
            },
        });
    }

    async updateUserState(user, state): Promise<any> {
        const { schema_id } = this.configService.get("ory");

        return fetch(`${this.adminUrl}/identities/${user.oryId}`, {
            method: "put",
            body: JSON.stringify({
                schema_id,
                state,
                traits: {
                    email: user.email,
                    user_id: user._id,
                },
            }),
            headers: {
                ...this.getHeaders(),
            },
        });
    }

    async updateUserRole(user, role): Promise<any> {
        const { schema_id } = this.configService.get("ory");
        const app_affiliation =
            this.configService.get<string>("app_affiliation");

        return await fetch(`${this.adminUrl}/identities/${user.oryId}`, {
            method: "put",
            body: JSON.stringify({
                schema_id,
                //When updating any traits, the user_id and email traits are required.
                traits: {
                    email: user.email,
                    user_id: user._id,
                    app_affiliation,
                    role,
                },
            }),
            headers: {
                ...this.getHeaders(),
            },
        });
    }

    async createIdentity(user, password, traits?: { role?: any }): Promise<any> {
        const { schema_id } = this.configService.get("ory");

        return fetch(`${this.adminUrl}/identities`, {
            method: "post",
            body: JSON.stringify({
                schema_id,
                traits: {
                    email: user.email,
                    user_id: user._id,
                    app_affiliation: this.app_affiliation,
                    role: traits?.role || { main: Roles.Regular },
                },
                credentials: {
                    password: {
                        config: { password },
                    },
                },
            }),
            headers: {
                ...this.getHeaders(),
            },
            credentials: "omit",
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        });
    }

    deleteIdentity(identityId): Promise<any> {
        const headers: HeadersInit = {};
        const { access_token: token } = this.configService.get("ory");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        return fetch(`${this.adminUrl}/identities/${identityId}`, {
            method: "delete",
            headers,
        });
    }

    async whoAmI(sessionCookies: string): Promise<any> {
        return await fetch(`${this.url}/sessions/whoami`, {
            headers: {
                Cookie: sessionCookies,
            },
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        });
    }
}
