import { ComponentMeta, ComponentStory } from "@storybook/react";

import ClaimSentence from "../../../components/Claim/ClaimSentence";
import { personality } from "../../fixtures";

export default {
    title: "Components/Claim/ClaimSentence",
    component: ClaimSentence,
    args: {
        claimType: "speech",
        summaryClassName: "claim-review",
        personality,
        sentence: {
            date: "2022-04-10T13:05:49.334Z",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
    },
    argTypes: {
        claimType: {
            options: ["speech", "twitter"],
        },
        summaryClassName: {
            options: ["claim-review", "none"],
            control: {
                type: "radio",
            },
        },
    },
    decorators: [
        (Story) => (
            <div style={{ width: "500px" }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof ClaimSentence>;

const Template: ComponentStory<typeof ClaimSentence> = (args) => (
    <ClaimSentence {...args} />
);

export const Default = Template.bind({});
Default.args = {};
