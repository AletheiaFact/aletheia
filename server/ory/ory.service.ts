import { Injectable } from "@nestjs/common";
import axios from "axios";
import { ConfigService } from "@nestjs/config";
import { Configuration, V0alpha2Api, V0alpha2ApiInterface } from "@ory/client";

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

    createIdentity(email, password): Promise<any> {
        const { access_token: token, url } = this.configService.get("ory");
        return axios({
            method: "post",
            url: `${url}/${this.adminEndpoint}/identities`,
            data: {
                schema_id: "preset://email",
                traits: { email },
                credentials: {
                    password: {
                        config: { password },
                    },
                },
            },
            headers: { Authorization: `Bearer ${token}` },
        });
    }
}
