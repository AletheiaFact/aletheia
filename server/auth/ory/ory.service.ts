import { Injectable } from "@nestjs/common";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { Configuration, V0alpha2Api, V0alpha2ApiInterface } from "@ory/client";
import { Roles } from "../../auth/ability/ability.factory";

@Injectable()
export default class OryService {
    private readonly adminEndpoint: string = "api/kratos/admin";
    readonly ory: V0alpha2ApiInterface;

    constructor(private configService: ConfigService) {
        const { access_token: accessToken, url } =
            this.configService.get("ory");
        this.ory = new V0alpha2Api(
            new Configuration({
                basePath: url,
                accessToken,
                baseOptions: {
                    // Ensures that cookies are included in CORS requests:
                    withCredentials: true,
                },
            })
        );
    }

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
        return axios({
            method: "put",
            url: `${url}/${this.adminEndpoint}/identities/${user.oryId}`,
            data: {
                schema_id,
                traits: {
                    email: user.email,
                    user_id: user._id,
                    role,
                },
                credentials,
            },
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    async updateUserState(user, state): Promise<any> {
        const {
            access_token: token,
            url,
            schema_id,
        } = this.configService.get("ory");

        return axios({
            method: "put",
            url: `${url}/${this.adminEndpoint}/identities/${user.oryId}`,
            data: {
                schema_id,
                state,
                traits: {
                    email: user.email,
                    user_id: user._id,
                },
            },
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    async updateUserRole(user, role): Promise<any> {
        const {
            access_token: token,
            url,
            schema_id,
        } = this.configService.get("ory");

        return axios({
            method: "put",
            url: `${url}/${this.adminEndpoint}/identities/${user.oryId}`,
            data: {
                schema_id,
                //When updating any traits, the user_id and email traits are required.
                traits: {
                    email: user.email,
                    user_id: user._id,
                    role: role,
                },
            },
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    async createIdentity(user, password, role?): Promise<any> {
        const {
            access_token: token,
            url,
            schema_id,
        } = this.configService.get("ory");
        return axios({
            method: "post",
            url: `${url}/${this.adminEndpoint}/identities`,
            data: {
                schema_id,
                traits: {
                    email: user.email,
                    user_id: user._id,
                    role: role ? role : Roles.Regular,
                },
                credentials: {
                    password: {
                        config: { password },
                    },
                },
            },
            headers: { Authorization: `Bearer ${token}` },
        });
    }

    deleteIdentity(identityId): Promise<any> {
        const { access_token: token, url } = this.configService.get("ory");
        return axios({
            method: "delete",
            url: `${url}/${this.adminEndpoint}/identities/${identityId}`,
            headers: { Authorization: `Bearer ${token}` },
        });
    }
}
