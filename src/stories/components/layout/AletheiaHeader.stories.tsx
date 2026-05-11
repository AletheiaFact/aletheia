import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import AletheiaHeader from "../../../components/Header/Header";
import ProviderWrapper from "../../ProviderWrapper";

export default {
    title: "Components/Layout/AletheiaHeader",
    component: AletheiaHeader,
    decorators: [
        (Story) => (
            <ProviderWrapper>
                <Story />
            </ProviderWrapper>
        ),
    ],
    argTypes: {
        zoom: {
            name: "Nível de Zoom",
            control: { type: "range", min: 0.5, max: 3, step: 0.1 },
        },
    },
    parameters: {
        layout: "fullscreen",
    },
} as ComponentMeta<typeof AletheiaHeader>;

const Template: ComponentStory<typeof AletheiaHeader> = ({ zoom }) => {
    return (
        <div
            style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top left",
                width: `${100 / zoom}%`,
            }}
        >
            <AletheiaHeader />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    zoom: 0.5,
};
