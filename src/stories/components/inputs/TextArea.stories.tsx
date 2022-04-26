import { ComponentStory, ComponentMeta } from "@storybook/react";
import TextArea from "../../../components/TextArea";

export default {
    title: "Components/Inputs/TextArea",
    component: TextArea,
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ]
} as ComponentMeta<typeof TextArea>;

const Template: ComponentStory<typeof TextArea> = (args) => (<TextArea  {...args} />)

export const Default = Template.bind({});
Default.args = {
    rows: 4,
    placeholder: "Placeholder",
    value: "Value",
}
