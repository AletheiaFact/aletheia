import { ComponentStory, ComponentMeta } from "@storybook/react";
import AletheiaMenu from "../../../components/AletheiaMenu";
import ProviderWrapper from "../../ProviderWrapper";

export default {
    title: "Components/Layout/Menu",
    component: AletheiaMenu,
    decorators: [
        (Story) => (<ProviderWrapper><Story /></ProviderWrapper>),
    ]
} as ComponentMeta<typeof AletheiaMenu>;

const Template: ComponentStory<typeof AletheiaMenu> = () => (<AletheiaMenu />)
export const Default = Template.bind({});
