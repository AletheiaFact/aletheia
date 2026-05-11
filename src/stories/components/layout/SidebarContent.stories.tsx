import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import SidebarContent from "../../../components/Header/SidebarContent";
import ProviderWrapper from "../../ProviderWrapper";
import colors from "../../../styles/colors";

const meta: Meta<typeof SidebarContent> = {
    title: "Components/Layout/SidebarContent",
    component: SidebarContent,
    decorators: [
        (Story) => (
            <ProviderWrapper>
                <div style={{
                    width: "100%",
                    padding: "18px",
                    backgroundColor: colors.primary,
                }}>
                    <Story />
                </div>
            </ProviderWrapper>
        ),
    ]
};

export default meta;

type Story = StoryObj<typeof SidebarContent>;

export const Default: Story = {};
