import { ComponentMeta, ComponentStory } from "@storybook/react";

import OverlaySearchInput from "../../../components/Search/OverlaySearchInput";
import ProviderWrapper from "../../ProviderWrapper";

export default {
    title: "Components/Layout/OverlaySearchInput",
    component: OverlaySearchInput,
    args: {
        overlay: {
            results: true,
            search: true,
        },
    },
    decorators: [
        (Story) => (
            <ProviderWrapper>
                <Story />
            </ProviderWrapper>
        ),
    ],
} as ComponentMeta<typeof OverlaySearchInput>;

const Template: ComponentStory<typeof OverlaySearchInput> = (args) => (
    <OverlaySearchInput />
);

export const Default = Template.bind({});
Default.args = {};
