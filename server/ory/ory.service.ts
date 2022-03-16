import {Injectable} from "@nestjs/common";
import axios from "axios";
import {ConfigService} from "@nestjs/config";
import { Configuration, V0alpha2Api } from "@ory/client";


@Injectable()
export default class OryService {
    private ory
    private readonly adminEndpoint: string = 'api/kratos/admin'

    constructor(
        private configService: ConfigService
    ) {
        const { access_token: accessToken, url } = this.configService.get('ory')
        this.ory = new V0alpha2Api(
            new Configuration({
                basePath: url,
                accessToken,
                baseOptions: {
                    // Ensures that cookies are included in CORS requests:
                    withCredentials: true
                }
            })
        );
    }

    createIdentity(email, password): Promise<any> {
        const { access_token: token, url } = this.configService.get('ory')
        return axios({
            method: 'post',
            url: `${url}/${this.adminEndpoint}/identities`,
            data: {
                schema_id: "preset://email",
                traits: {email},
                credentials: {
                    password: {
                        config: {password}
                    }
                }
            },
            headers: { Authorization: `Bearer ${token}` }
        })
    }

    // async submit(flowId, formData, req) {
    //     console.log("cookies", req.cookies)
    //     const { csrf_token } = formData
    //     const headers = {
    //         // referer: req?.headers?.referer,
    //         'X-XSRF-Token': csrf_token,
    //         'X-CSRF-Token': csrf_token
    //     }
    //     // console.log(headers)
    //     // console.log(formData)
    //     try {
    //         const { data } =
    //             await this.ory.submitSelfServiceRegistrationFlow(flowId, formData, { headers })
    //         // console.log("submit", data)
    //         return data
    //     } catch (e) {
    //         console.log("error")
    //         console.log(e?.request?.headers)
    //         console.log(e?.response?.headers)
    //         console.log(e?.response?.data)
    //         // console.log(e?.request?.headers)
    //         // console.log(e?.request?.headers['set-cookie'])
    //         throw e
    //     }
    // }
}
