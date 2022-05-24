import LocalizedDate from "../../../components/LocalizedDate";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
    title: "Components/Typography/LocalizedDate",
    component: LocalizedDate,
    argTypes: {
        date: {
            control: {
                type: "date"
            }
        }
    }
} as ComponentMeta<typeof LocalizedDate>;

const today = new Date();
const Template: ComponentStory<typeof LocalizedDate> = (args) => (
    <LocalizedDate {...args} />
);


export const Default = Template.bind({});
Default.args = { date: today, showTime: false };

export const WithTime = Template.bind({});
WithTime.args = { date: today, showTime: true };
