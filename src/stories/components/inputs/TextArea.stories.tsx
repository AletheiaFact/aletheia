import { ComponentStory, ComponentMeta } from "@storybook/react";
import AletheiaTextArea from "../../../components/AletheiaTextArea";

export default {
    title: "Components/Inputs/TextArea",
    component: AletheiaTextArea,
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ]
} as ComponentMeta<typeof AletheiaTextArea>;

const Template: ComponentStory<typeof AletheiaTextArea> = (args) => (<AletheiaTextArea  {...args} />)

export const Default = Template.bind({});
Default.args = {
    rows: 4,
    placeholder: "Placeholder",
    value: "Value",
}
