import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Roles } from "../../auth/ability/ability.factory";

@Injectable()
export default class OryService {
    private adminUrl: string;
    private url: string;
    private app_affiliation: string | undefined;

    constructor(private configService: ConfigService) {
        const { admin_url, admin_endpoint, url } =
            this.configService.get("ory");
        this.url = url;
        this.adminUrl = `${admin_url}/${admin_endpoint}`;
        this.app_affiliation =
            this.configService.get<string>("app_affiliation");
    }

    /**
     * Kratos' admin PUT replaces the whole traits object, so every update must
     * send the full set — a trait left out is erased on the identity.
     */
    private buildTraits(user: any, role?: Record<string, any>) {
        return {
            email: user.email,
            user_id: String(user._id),
            app_affiliation: this.app_affiliation,
            role: role ?? user.role ?? { main: Roles.Regular },
        };
    }

    private async putIdentity(
        user: any,
        body: Record<string, any>
    ): Promise<any> {
        const { access_token: token, schema_id } =
            this.configService.get("ory");
        const response = await fetch(
            `${this.adminUrl}/identities/${user.oryId}`,
            {
                method: "put",
                body: JSON.stringify({ schema_id, ...body }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (!response.ok) {
            const detail = await response.text().catch(() => "");
            throw new Error(
                `Failed to update identity ${user.oryId}: ${response.status} ${detail}`
            );
        }
        return response;
    }

    async updateIdentity(
        user: any,
        password: string,
        traits?: { role?: any }
    ): Promise<any> {
        const credentials = password
            ? {
                  password: {
                      config: { password },
                  },
              }
            : {};
        return this.putIdentity(user, {
            traits: this.buildTraits(user, traits?.role),
            credentials,
        });
    }

    async updateUserState(
        user: any,
        state: string,
        role?: Record<string, any>
    ): Promise<any> {
        return this.putIdentity(user, {
            state,
            traits: this.buildTraits(user, role),
        });
    }

    async updateUserRole(
        user: any,
        role: Record<string, string>
    ): Promise<any> {
        return this.putIdentity(user, {
            traits: this.buildTraits(user, role),
        });
    }

    async createIdentity(
        user: any,
        password: string,
        traits?: { role?: any }
    ): Promise<any> {
        const { access_token: token, schema_id } =
            this.configService.get("ory");

        return fetch(`${this.adminUrl}/identities`, {
            method: "post",
            body: JSON.stringify({
                schema_id,
                traits: this.buildTraits(user, traits?.role),
                credentials: {
                    password: {
                        config: { password },
                    },
                },
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            credentials: "omit",
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        });
    }

    deleteIdentity(identityId: string): Promise<any> {
        const { access_token: token } = this.configService.get("ory");
        return fetch(`${this.adminUrl}/identities/${identityId}`, {
            method: "delete",
            headers: { Authorization: `Bearer ${token}` },
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

    async getIdentity(id: string): Promise<any> {
        const { access_token: token } = this.configService.get("ory");
        const response = await fetch(`${this.adminUrl}/identities/${id}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(
                `Failed to fetch identity ${id}: ${response.status}`
            );
        }
        return response.json();
    }
}
