import HighlightedSearchText from "../../../components/HighlightedSearchText";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
    title: "Components/Typography/HighlightedSearchText",
    component: HighlightedSearchText,
    decorators: [
        (Story) => (
            <div style={{ width: "500px" }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof HighlightedSearchText>;

const Template: ComponentStory<typeof HighlightedSearchText> = (args) => (
    <HighlightedSearchText {...args} />
);

export const Default = Template.bind({});
Default.args = { text: "This is a test string", highlight: "test" };
