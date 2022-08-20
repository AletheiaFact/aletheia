import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import ClassificationText from "../../../components/ClassificationText";
import { classifications } from "../../fixtures";

export default {
    title: "Components/Typography/ClassificationText",
    component: ClassificationText,
    argTypes: {
        classification: {
            options: classifications,
            control: {
                type: "select",
            },
        },
    },
} as ComponentMeta<typeof ClassificationText>;

const Template: ComponentStory<typeof ClassificationText> = (args) => (
    <ClassificationText {...args} />
);

export const True = Template.bind({});
True.args = {
    classification: "trustworthy",
};

export const TrueBut = Template.bind({});
TrueBut.args = {
    classification: "trustworthy-but",
};

export const Arguable = Template.bind({});
Arguable.args = {
    classification: "arguable",
};

export const Misleading = Template.bind({});
Misleading.args = {
    classification: "misleading",
};

export const False = Template.bind({});
False.args = {
    classification: "false",
};

export const Unsustainable = Template.bind({});
Unsustainable.args = {
    classification: "unsustainable",
};

export const Exaggerated = Template.bind({});
Exaggerated.args = {
    classification: "exaggerated",
};

export const NotFact = Template.bind({});
NotFact.args = {
    classification: "not-fact",
};

export const Unverifiable = Template.bind({});
Unverifiable.args = {
    classification: "unverifiable",
};
