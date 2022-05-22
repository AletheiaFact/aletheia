import { SearchOutlined } from "@ant-design/icons";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import InputSearch from "../../../components/Form/InputSearch";

export default {
    title: "Components/Inputs/InputSearch",
    component: InputSearch,
    callback: { action: "clicked" },
    args: {
        placeholder: "Search",
    },
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof InputSearch>;

const Template: ComponentStory<typeof InputSearch> = (args) => (
    <InputSearch {...args} />
);

export const Default = Template.bind({});

export const WithSuffix = Template.bind({});
WithSuffix.args = {
    suffix: <SearchOutlined />
}
