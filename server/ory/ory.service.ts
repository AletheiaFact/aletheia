import {Injectable} from "@nestjs/common";
import axios from "axios";
import {ConfigService} from "@nestjs/config";
import { Configuration, V0alpha2Api } from "@ory/client";


@Injectable()
export default class OryService {
    private ory
    constructor(
        private configService: ConfigService
    ) {
        const { access_token: accessToken, url } = this.configService.get('ory')
        console.log(accessToken, url)
        this.ory = new V0alpha2Api(
            new Configuration({
                basePath: url,
                accessToken
            })
        );
    }

    async browser() {

        const { data } =
            await this.ory.initializeSelfServiceRegistrationFlowForBrowsers()
        // console.log("browser", data);
        return data
        // return await axios.get(`${url}/self-service/registration/browser`)
    }

    async submit(flowId, formData) {
        console.log(formData)
        try {
            const { data } =
                await this.ory.submitSelfServiceRegistrationFlow(flowId, formData)
            // console.log("submit", data)
            return data
        } catch (e) {
            // console.log(e)
            console.log(e?.response?.data)
            throw e
        }
    }
}
