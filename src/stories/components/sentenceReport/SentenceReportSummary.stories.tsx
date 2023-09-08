import { ComponentMeta } from "@storybook/react";
import SentenceReportSummary from "../../../components/SentenceReport/SentenceReportSummary";

export default {
    title: "Components/Claim/SentenceReportSummary",
    component: SentenceReportSummary,
    argTypes: {
        content: {
            type: "string",
        },
    },
    args: {
        content: "This is a claim summary",
    },
    decorators: [
        (Story) => (
            <div style={{ width: "500px" }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof SentenceReportSummary>;

export const Default = (args) => (
    <SentenceReportSummary>{args.content}</SentenceReportSummary>
);

export const ClaimReview = (args) => (
    <SentenceReportSummary className="claim-review">
        {args.content}
    </SentenceReportSummary>
);
