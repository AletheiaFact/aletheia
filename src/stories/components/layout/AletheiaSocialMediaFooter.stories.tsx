import { ComponentMeta, ComponentStory } from "@storybook/react";

import AletheiaSocialMediaFooter from "../../../components/Footer/AletheiaSocialMediaFooter";

export default {
    title: "Components/Layout/AletheiaSocialMediaFooter",
    component: AletheiaSocialMediaFooter,
    parameters: {
        backgrounds: { default: "blue" },
    },
} as ComponentMeta<typeof AletheiaSocialMediaFooter>;

export const Default: ComponentStory<typeof AletheiaSocialMediaFooter> = () => (
    <AletheiaSocialMediaFooter />
);
