import AletheiaSocialMediaFooter from "../components/AletheiaSocialMediaFooter";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
    title: "Components/AletheiaSocialMediaFooter",
    component: AletheiaSocialMediaFooter,
    parameters: {
        backgrounds: { default: "dark" }
    }
} as ComponentMeta<typeof AletheiaSocialMediaFooter>;

export const Default: ComponentStory<typeof AletheiaSocialMediaFooter> = () => <AletheiaSocialMediaFooter />;
