import { ComponentStory, ComponentMeta } from "@storybook/react";
import AffixButton from "../../../components/Form/AffixButton";

export default {
    title: "Components/Buttons/AffixButton",
    component: AffixButton,
    onClick: { action: "clicked" },
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof AffixButton>;

const Template: ComponentStory<typeof AffixButton> = (args) => (
    <AffixButton {...args} />
);

export const Default = Template.bind({});
Default.args = {
    tooltipTitle: "Click me",
    href: "http://localhost:6006/?path=/story/components-buttons-affixbutton--default"
};
