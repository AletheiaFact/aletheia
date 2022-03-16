import {Module} from "@nestjs/common";
import OryController from "./ory.controller";
import {ConfigService} from "@nestjs/config";
import {ViewModule} from "../view/view.module";
import OryService from "./ory.service";

@Module({
    imports: [ ViewModule ],
    controllers: [ OryController ],
    providers: [ OryService, ConfigService ],
    exports: [OryService]
})
export default class OryModule {}
