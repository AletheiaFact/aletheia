import { ComponentStory, ComponentMeta } from "@storybook/react";
import InputPassword from "../../../components/InputPassword";

export default {
    title: "Components/Inputs/Password",
    component: InputPassword,
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof InputPassword>;

export const Default: ComponentStory<typeof InputPassword> = () => (<InputPassword />);
