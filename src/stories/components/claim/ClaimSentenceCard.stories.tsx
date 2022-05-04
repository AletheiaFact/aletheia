import { ComponentStory, ComponentMeta } from "@storybook/react";
import ClaimSentenceCard from "../../../components/ClaimReview/ClaimSentenceCard";
import { personality } from "../../fixtures";

export default {
    title: "Components/Claim/ClaimSentenceCard",
    component: ClaimSentenceCard,
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
} as ComponentMeta<typeof ClaimSentenceCard>;

const Template: ComponentStory<typeof ClaimSentenceCard> = (args) => (
    <ClaimSentenceCard {...args} />
);

export const Default = Template.bind({});
Default.args = {
};
