import { ComponentStory, ComponentMeta } from '@storybook/react';
import MetricsOverview from '../../../components/Metrics/MetricsOverview';
import { getStats } from '../../fixtures';

export default {
    title: 'Components/Metrics/MetricsOverview',
    component: MetricsOverview,
    args: {
        stats: {
            total: 1,
            reviews: [
                {
                    _id: "true",
                    percentage: "100",
                    count: 1
                }
            ],
            totalClaims: 23,
        }
    },
} as ComponentMeta<typeof MetricsOverview>;

const Template: ComponentStory<typeof MetricsOverview> = (args) => (
    <MetricsOverview {...args} />
);

export const OneStat = Template.bind({});
OneStat.args = {};

export const ManyStats = Template.bind({});
ManyStats.args = {
    stats: {
        total: 8,
        reviews: getStats(8),
        totalClaims: 8,
    }
}

export const Empty = Template.bind({});
Empty.args = {
    stats: {
        total: 0,
        reviews: [],
        totalClaims: null,
    }
}
