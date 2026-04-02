import { Injectable, Optional } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UnleashService } from "nestjs-unleash";
import { Environments } from "../types/enums";

@Injectable()
export class FeatureFlagService {
    constructor(
        private configService: ConfigService,
        @Optional() private readonly unleash: UnleashService
    ) {}

    isEnableCollaborativeEditor() {
        const config = this.configService.get<string>("feature_flag");

        return config
            ? this.unleash.isEnabled("enable_collaborative_editor")
            : false;
    }

    isEnableCopilotChatBot() {
        const config = this.configService.get<string>("feature_flag");

        return config ? this.unleash.isEnabled("copilot_chat_bot") : false;
    }

    isEnableEventsFeature() {
    const config = this.configService.get<string>("feature_flag");
    const isWatchDevOrTest = process.env.ENVIRONMENT === Environments.WATCH_DEV || process.env.ENVIRONMENT === Environments.DEVELOPMENT;

    if (!config) {
        return isWatchDevOrTest;
    }

    const isEnabledOnUnleash = this.unleash.isEnabled("enable_events_feature");

    return isEnabledOnUnleash || isWatchDevOrTest;
}

    isEnableEditorAnnotations() {
        const config = this.configService.get<string>("feature_flag");

        return config
            ? this.unleash.isEnabled("enable_editor_annotations")
            : false;
    }

    isEnableReviewersUpdateReport() {
        const config = this.configService.get<string>("feature_flag");

        return config
            ? this.unleash.isEnabled("enable_reviewers_update_report")
            : false;
    }

    isEnableViewReportPreview() {
        const config = this.configService.get<string>("feature_flag");

        return config
            ? this.unleash.isEnabled("enable_view_report_preview")
            : false;
    }
}
