import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Roles } from "../../auth/ability/ability.factory";

@Injectable()
export default class OryService {
    private readonly adminEndpoint: string = "api/kratos/admin";
    constructor(private configService: ConfigService) {}

    async updateIdentity(user, password, role): Promise<any> {
        const {
            access_token: token,
            url,
            schema_id,
        } = this.configService.get("ory");
        const credentials = password
            ? {
                  password: {
                      config: { password },
                  },
              }
            : {};
        return fetch(`${url}/${this.adminEndpoint}/identities/${user.oryId}`, {
            method: "put",
            body: JSON.stringify({
                schema_id,
                traits: {
                    email: user.email,
                    user_id: user._id,
                    role,
                },
                credentials,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    }

    async updateUserState(user, state): Promise<any> {
        const {
            access_token: token,
            url,
            schema_id,
        } = this.configService.get("ory");

        return fetch(`${url}/${this.adminEndpoint}/identities/${user.oryId}`, {
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
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    }

    async updateUserRole(user, role): Promise<any> {
        const {
            access_token: token,
            url,
            schema_id,
        } = this.configService.get("ory");

        return fetch(`${url}/${this.adminEndpoint}/identities/${user.oryId}`, {
            method: "put",
            body: JSON.stringify({
                schema_id,
                //When updating any traits, the user_id and email traits are required.
                traits: {
                    email: user.email,
                    user_id: user._id,
                    role,
                },
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    }

    async createIdentity(user, password, role?): Promise<any> {
        const {
            access_token: token,
            url,
            schema_id,
        } = this.configService.get("ory");
        const result = await fetch(`${url}/${this.adminEndpoint}/identities`, {
            method: "post",
            body: JSON.stringify({
                schema_id,
                traits: {
                    email: user.email,
                    user_id: user._id,
                    role: role || { main: Roles.Regular },
                },
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
        });
        // FIXME: log errors in the server when  creating an user
        return await result.json();
    }

    deleteIdentity(identityId): Promise<any> {
        const { access_token: token, url } = this.configService.get("ory");
        return fetch(`${url}/${this.adminEndpoint}/identities/${identityId}`, {
            method: "delete",
            headers: { Authorization: `Bearer ${token}` },
        });
    }
}
