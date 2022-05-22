import { ComponentStory, ComponentMeta } from '@storybook/react';
import ClaimCardHeader from '../../../components/Claim/ClaimCardHeader';
import { personality } from '../../fixtures';

export default {
    title: 'Components/Claim/ClaimCardHeader',
    component: ClaimCardHeader,
    args: {
        personality,
        date: "2022-04-10T13:05:49.334Z",
        claimType: 'speech'
    },
} as ComponentMeta<typeof ClaimCardHeader>;

const Template: ComponentStory<typeof ClaimCardHeader> = (args) => (
    <ClaimCardHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {};
