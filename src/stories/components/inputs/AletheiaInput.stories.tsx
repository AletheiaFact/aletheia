import { ComponentStory, ComponentMeta } from "@storybook/react";
import AletheiaInput from "../../../components/AletheiaInput";

export default {
    title: "Components/Inputs/Input",
    component: AletheiaInput,
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof AletheiaInput>;

export const Default: ComponentStory<typeof AletheiaInput> = () => (<AletheiaInput placeholder='Default input' />);
