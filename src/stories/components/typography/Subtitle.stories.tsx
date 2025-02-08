import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Typography } from "@mui/material";
import Paragraph from "../../../components/Paragraph";
import Subtitle from "../../../components/Subtitle";

export default {
    title: "Components/Typography/Subtitle",
    component: Subtitle,
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof Subtitle>;

const Template: ComponentStory<typeof Subtitle> = (args) => (
    <Subtitle>{args.subtitle}</Subtitle>
);

const ComparisonTemplate: ComponentStory<typeof Subtitle> = (args) => (
    <>
        <Typography variant="h1" fontWeight={600} fontSize={38}>{args.title}</Typography>
        <Subtitle>{args.subtitle}</Subtitle>
        <Paragraph>{args.paragraph}</Paragraph>
    </>
);

export const Default = Template.bind({});
Default.args = { subtitle: "Subtitle" };


export const Comparison = ComparisonTemplate.bind({});
Comparison.args = {
    title: "Title",
    subtitle: "Subtitle",
    paragraph: "Paragraph",
}
