import { Injectable, Optional } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UnleashService } from "nestjs-unleash";

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

    isEnableEditorAnnotations() {
        const config = this.configService.get<string>("feature_flag");

        return config
            ? this.unleash.isEnabled("enable_editor_annotations")
            : false;
    }

    isEnableAddEditorSourcesWithoutSelecting() {
        const config = this.configService.get<string>("feature_flag");

        return config
            ? this.unleash.isEnabled(
                  "enable_add_editor_sources_without_selecting"
              )
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
