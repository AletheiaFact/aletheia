import { ComponentMeta } from "@storybook/react";
import ToggleSection from "../../../components/ToggleSection";

export default {
    title: "Components/Buttons/ToggleSection",
    component: ToggleSection,
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ],
    args: {
        labelTrue: "Label true", labelFalse: "Label false"
    }
} as ComponentMeta<typeof ToggleSection>;

export const SetToTrue = (args) => (<ToggleSection {...args} defaultValue={true} />)

export const SetToFalse = (args) => (<ToggleSection {...args} defaultValue={false} />)
