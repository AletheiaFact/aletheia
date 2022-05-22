import AletheiaSocialMediaFooter from "../../../components/AletheiaSocialMediaFooter";
import { ComponentStory, ComponentMeta } from "@storybook/react";

export default {
    title: "Components/Layout/AletheiaSocialMediaFooter",
    component: AletheiaSocialMediaFooter,
    parameters: {
        backgrounds: { default: "blue" }
    }
} as ComponentMeta<typeof AletheiaSocialMediaFooter>;

export const Default: ComponentStory<typeof AletheiaSocialMediaFooter> = () => <AletheiaSocialMediaFooter />;
