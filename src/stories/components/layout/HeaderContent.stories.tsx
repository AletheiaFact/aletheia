import { ComponentStory, ComponentMeta } from "@storybook/react";
import HeaderContent from "../../../components/Header/HeaderContent";
import ProviderWrapper from "../../ProviderWrapper";

export default {
    title: "Components/Layout/HeaderContent",
    component: HeaderContent,
    decorators: [
        (Story) => (<ProviderWrapper><Story /></ProviderWrapper>),
    ]
} as ComponentMeta<typeof HeaderContent>;

const Template: ComponentStory<typeof HeaderContent> = () => (<HeaderContent className="aletheia-header" />)
export const Default = Template.bind({});
