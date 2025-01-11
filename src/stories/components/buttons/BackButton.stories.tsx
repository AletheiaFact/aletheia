import { ComponentStory, ComponentMeta } from "@storybook/react";
import BackButton from "../../../components/BackButton";
import colors from "../../../styles/colors";

export default {
    title: "Components/Buttons/BackButton",
    component: BackButton,
    parameters: {
        nextRouter: {
            path: "/personality",
            asPath: "/personality",
            pathname: "/personality",
        },
    },
} as ComponentMeta<typeof BackButton>;

const Template: ComponentStory<typeof BackButton> = (args) => (
    <BackButton {...args} />
);

export const Default = Template.bind({});
Default.args = {};

export const Underlined = Template.bind({});
Underlined.args = {
    style: {
        color: colors.white,
        textDecoration: "underline",
    },
};
Underlined.parameters = {
    backgrounds: {
        default: "blue",
    },
};
