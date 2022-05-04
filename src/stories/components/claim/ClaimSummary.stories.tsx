import { ComponentMeta } from "@storybook/react";
import ClaimSummary from "../../../components/Claim/ClaimSummary";

export default {
    title: 'Components/Claim/ClaimSummary',
    component: ClaimSummary,
    argTypes: {
        content: {
            type: 'string',
        }
    },
    args: {
        content: 'This is a claim summary'
    },
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof ClaimSummary>;

export const Default = (args) => (<ClaimSummary>{args.content}</ClaimSummary>)

export const ClaimReview = (args) => (<ClaimSummary className="claim-review">{args.content}</ClaimSummary>)
