import AletheiaButton, { ButtonType } from "../../../components/Button";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
    title: "Components/Buttons/AletheiaButton",
    component: AletheiaButton,
    argTypes: {
        onClick: { action: "clicked" },
        type: {
            options: Object.values(ButtonType),
            mapping: ButtonType,
            control: {
                type: "select",
            },
        },
    },
} as ComponentMeta<typeof AletheiaButton>;

const Template: ComponentStory<typeof AletheiaButton> = (args) => (
    <AletheiaButton {...args}>{args.children}</AletheiaButton>
);


export const Default = Template.bind({});
Default.args = { children: "Default Button type is blue" };

export const Blue = Template.bind({});
Blue.args = { children: "Blue Button", type: ButtonType.blue };

export const White = Template.bind({});
White.args = { type: ButtonType.white, children: "White Button" };
White.parameters = {
    backgrounds: {
        default: "blue"
    }
}
export const WhiteBlack = Template.bind({});
WhiteBlack.args = { type: ButtonType.whiteBlack, children: "white Black Button" };

export const WhiteBlue = Template.bind({});
WhiteBlue.args = { type: ButtonType.whiteBlue, children: "white Blue Button" };
