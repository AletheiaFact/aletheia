import { ComponentStory, ComponentMeta } from '@storybook/react';
import PersonalityCreateCTA from '../../../components/Personality/PersonalityCreateCTA';

export default {
    title: 'Components/Personality/PersonalityCreateCTA',
    component: PersonalityCreateCTA,
    args: {
        href: './'
    },
} as ComponentMeta<typeof PersonalityCreateCTA>;

const Template: ComponentStory<typeof PersonalityCreateCTA> = (args) => (
    <PersonalityCreateCTA {...args} />
);

export const Default = Template.bind({});
Default.args = {};
