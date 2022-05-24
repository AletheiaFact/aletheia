import { ComponentStory, ComponentMeta } from '@storybook/react';
import ClaimCard from '../../../components/Claim/ClaimCard';
import { personality, claim } from '../../fixtures';

export default {
    title: 'Components/Claim/ClaimCard',
    component: ClaimCard,
    args: {
        personality,
        claim
    },
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof ClaimCard>;

const Template: ComponentStory<typeof ClaimCard> = (args) => (
    <ClaimCard {...args} />
);

export const Default = Template.bind({});
Default.args = {};
