import { ReviewTaskTypeEnum } from "../../../machines/reviewTask/enums";
import SummaryExtension from "../Form/SummaryExtesion";
import QuestionExtension from "../Form/QuestionExtension";
import ReportExtension from "../Form/ReportExtension";
import VerificationExtension from "../Form/VerificationExtension";
import {
    AnnotationExtension,
    LinkExtension,
    TrailingNodeExtension,
} from "remirror/extensions";
import { YjsExtension } from "@remirror/extension-yjs";
import SourceReviewEditor from "../Components/SourceReviewEditor";
import ClaimReviewEditor from "../Components/ClaimReviewEditor";
import { MarkExtension, NodeExtension, PlainExtension } from "remirror";
import { SimplePasteFilter } from "../extensions/SimplePasteFilter";

export class EditorConfig {
    getExtensions(
        type: string,
        websocketProvider: any,
        enableEditorAnnotations: boolean
    ): Partial<NodeExtension | PlainExtension | MarkExtension>[] {
        const baseExtensions: Partial<
            NodeExtension | PlainExtension | LinkExtension
        >[] = [
            new SimplePasteFilter(),
            new SummaryExtension({ disableExtraAttributes: true }),
            new TrailingNodeExtension(),
            new LinkExtension({
                extraAttributes: { id: () => null },
                autoLink: type === ReviewTaskTypeEnum.Claim,
                selectTextOnClick: true,
            }),
        ];

        if (websocketProvider) {
            baseExtensions.push(
                new YjsExtension({ getProvider: () => websocketProvider })
            );
        }

        if (enableEditorAnnotations) {
            // TODO: Make annotations shared across documents
            baseExtensions.push(new AnnotationExtension());
        }

        switch (type) {
            case ReviewTaskTypeEnum.Source:
                return baseExtensions;
            case ReviewTaskTypeEnum.Claim:
                return [
                    ...baseExtensions,
                    new QuestionExtension({ disableExtraAttributes: true }),
                    new ReportExtension({ disableExtraAttributes: true }),
                    new VerificationExtension({ disableExtraAttributes: true }),
                ];
            default:
                return [];
        }
    }

    getComponents(type: string, props: any): JSX.Element {
        switch (type) {
            case ReviewTaskTypeEnum.Source:
                return <SourceReviewEditor {...props} />;
            case ReviewTaskTypeEnum.Claim:
                return <ClaimReviewEditor {...props} />;
            default:
                return <></>;
        }
    }
}
