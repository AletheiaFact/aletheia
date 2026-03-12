import { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import FilterToggleButtons, { ViewMode } from "../../../components/FilterToggleButtons";

export default {
    title: "Components/Buttons/FilterToggleButtons",
    component: FilterToggleButtons,
    decorators: [
        (Story) => (
            <div style={{ width: '500px', padding: '20px' }}>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        setViewMode: { action: 'mode changed' },
        leftOption: { control: 'text' },
        rightOption: { control: 'text' },
    }
} as ComponentMeta<typeof FilterToggleButtons>;

const Template: ComponentStory<typeof FilterToggleButtons> = (args) => {
    const [mode, setMode] = useState<ViewMode>(args.viewMode || "left");
    
    return (
        <FilterToggleButtons 
            {...args} 
            viewMode={mode} 
            setViewMode={(newMode) => {
                setMode(newMode);
                args.setViewMode(newMode);
            }} 
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    leftOption: "Board View",
    rightOption: "List View",
    isRounded: false,
};

export const Rounded = Template.bind({});
Rounded.args = {
    leftOption: "Option A",
    rightOption: "Option B",
    isRounded: true,
};

export const WithIcons = Template.bind({});
WithIcons.args = {
    leftOption: "🌑 Dark",
    rightOption: "☀️ Light",
    isRounded: true,
};