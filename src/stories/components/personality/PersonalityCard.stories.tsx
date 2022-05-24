import { ComponentMeta } from "@storybook/react";
import PersonalityCard from "../../../components/Personality/PersonalityCard";
import { claim, classifications, getStats, personality } from "../../fixtures";




export default {
    title: "Components/Personality/PersonalityCard",
    component: PersonalityCard,
    decorators: [
        (Story) => (
            <div style={{ width: "500px" }}>
                <Story />
            </div>
        ),
    ],
    args: {
        personality,
        numOfStats: 3,
        hasClaims: true,
    },
    argTypes: {
        numOfStats: {
            control: {
                type: "range",
                min: 0,
                max: classifications.length,
                step: 1,
            },
        },
        hasClaims: {
            control: { type: "boolean" },
        },
    },
} as ComponentMeta<typeof PersonalityCard>;

const Template = (args) => {

    if (!args.hasClaims) {
        personality.claims = [];
        personality.stats.reviews = [];
    }
    else {
        personality.claims = [claim];
        personality.stats.reviews = getStats(args.numOfStats)
    }

    return <PersonalityCard personality={personality} {...args} />;
};

export const Default = Template.bind({});

export const summarized = Template.bind({});
summarized.args = {
    summarized: true,
};

export const disableStats = Template.bind({});
disableStats.args = {
    enableStats: false,
};

export const allStats = Template.bind({});
allStats.args = {
    numOfStats: classifications.length,
};

export const sumarizedAllStats = Template.bind({});
sumarizedAllStats.args = {
    numOfStats: classifications.length,
    summarized: true,
};

export const header = Template.bind({});
header.args = {
    summarized: true,
    header: true,
};
