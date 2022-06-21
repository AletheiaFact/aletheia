import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Form } from "antd";
import AletheiaInput from "../../../components/AletheiaInput";
import Label from "../../../components/Label";

export default {
    title: "Components/Typography/Label",
    component: Label,
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ],
    args: { children: "Label" }
} as ComponentMeta<typeof Label>;


export const Default: ComponentStory<typeof Label> = (args) => (
    <Label>{args.children}</Label>
);


const TemplateWithInput: ComponentStory<any> = (args) => (
    <Form.Item
        label={
            <Label>
                {args.children}
            </Label>
        }
    >
        <AletheiaInput
            placeholder={args.inputPlaceholder}
        />
    </Form.Item>
)

export const WithInput = TemplateWithInput.bind({})
WithInput.args = {
    children: "Label",
    inputPlaceholder: "Input placeholder",
}
