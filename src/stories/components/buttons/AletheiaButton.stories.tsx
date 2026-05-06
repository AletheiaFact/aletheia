import AletheiaButton, { ButtonType } from "../../../components/AletheiaButton";
import type { Meta, StoryObj } from "@storybook/react";

const SIZE_OPTIONS = ["small", "medium", "large"] as const;

const meta: Meta<typeof AletheiaButton> = {
    title: "Components/Buttons/AletheiaButton",
    component: AletheiaButton,
    parameters: {
        controls: {
            exclude: [
                "ref",
                "component",
                "onClick",
                "target",
                "htmlType",
                "loading",
                "event",
            ],
        },
    },
    argTypes: {
        type: {
            options: Object.values(ButtonType),
            mapping: ButtonType,
            control: { type: "select" },
        },
        size: {
            options: SIZE_OPTIONS,
            control: { type: "inline-radio" },
        },
        fullWidth: { control: { type: "boolean" } },
        rounded: { control: { type: "boolean" } },
        fontWeight: { control: { type: "text" } },
        disabled: { control: { type: "boolean" } },
        children: { control: { type: "text" } },
    },
};

export default meta;

type Story = StoryObj<typeof AletheiaButton>;

// Background per variant — picked so the button stays visible/contrasted
// against the canvas. Light variants live on the blue/dark backgrounds;
// dark/coloured variants live on the light background.

export const Default: Story = {
    args: { children: "Default Button (namespace color)" },
    parameters: { backgrounds: { default: "light" } },
};

export const Primary: Story = {
    args: { type: ButtonType.primary, children: "Primary Button" },
    parameters: { backgrounds: { default: "light" } },
};

export const Secondary: Story = {
    args: { type: ButtonType.secondary, children: "Secondary Button" },
    parameters: { backgrounds: { default: "light" } },
};

export const Outline: Story = {
    args: { type: ButtonType.outline, children: "Outline Button" },
    parameters: { backgrounds: { default: "light" } },
};

export const White: Story = {
    args: { type: ButtonType.white, children: "White Button" },
    parameters: { backgrounds: { default: "blue" } },
};

export const Gray: Story = {
    args: { type: ButtonType.gray, children: "Gray Button" },
    parameters: { backgrounds: { default: "blue" } },
};

export const WhiteBlue: Story = {
    args: { type: ButtonType.whiteBlue, children: "White Blue Button" },
    parameters: { backgrounds: { default: "light" } },
};

export const WhiteBlack: Story = {
    args: { type: ButtonType.whiteBlack, children: "White Black Button" },
    parameters: { backgrounds: { default: "blue" } },
};

export const LightBlue: Story = {
    args: { type: ButtonType.lightBlue, children: "Light Blue Button" },
    parameters: { backgrounds: { default: "light" } },
};

export const Text: Story = {
    args: { type: ButtonType.text, children: "Text Button" },
    parameters: { backgrounds: { default: "light" } },
};
