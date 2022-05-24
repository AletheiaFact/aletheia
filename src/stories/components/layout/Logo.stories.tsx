import { ComponentStory, ComponentMeta } from "@storybook/react";
import Logo from "../../../components/Header/Logo";

export default {
    title: "Components/Layout/Logo",
    component: Logo,
    argTypes: {
        color: {
            options: ['blue', 'white'],
            control: 'radio'
        }
    }
} as ComponentMeta<typeof Logo>;

const Template: ComponentStory<typeof Logo> = (args) => (<Logo {...args} />)
export const Blue = Template.bind({});
Blue.args = { color: 'blue' };

export const White = Template.bind({});
White.args = { color: "white" };
White.parameters = {
    backgrounds: { default: "dark" }

}
