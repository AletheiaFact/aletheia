import { ComponentStory, ComponentMeta } from "@storybook/react";
import { FormControl, FormLabel } from "@mui/material";
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
    <FormControl style={{ display: "flex", flexDirection: "row", gap: 10 }} >
        <FormLabel>
            <Label>
                {args.children}:
            </Label>
        </FormLabel>
        <AletheiaInput
            placeholder={args.inputPlaceholder}
        />
    </FormControl>
)

export const WithInput = TemplateWithInput.bind({})
WithInput.args = {
    children: "Label",
    inputPlaceholder: "Input placeholder",
}
