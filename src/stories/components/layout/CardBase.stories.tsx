import CardBase from "../../../components/CardBase";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
    title: "Components/Layout/CardBase",
    component: CardBase,
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof CardBase>;

const Template: ComponentStory<typeof CardBase> = (args) => (<CardBase>
    {args.children}
</CardBase>);

export const Default = Template.bind({});
Default.args = {
    children: "CardBase simple text content"
}
