import { ComponentStory, ComponentMeta } from '@storybook/react';
import ReviewStats from '../../../components/Metrics/ReviewStats';
import { classifications, getStats } from '../../fixtures';

export default {
    title: 'Components/Metrics/ReviewStats',
    component: ReviewStats,
    decorators: [
        (Story) => (
            <div style={{ width: "200px" }}>
                <Story />
            </div>
        ),
    ],
    argTypes: {
        numOfStats: {
            control: {
                type: "range",
                min: 0,
                max: classifications.length,
                step: 1,
            },
        },
        type: {
            options: ['line', 'circle'],
            control: { type: 'radio' }
        },
        format: {
            options: ['percentage', 'count'],
            control: { type: 'radio' }
        }
    },
    args: {
        stats: {
            reviews: [
                {
                    "_id": "true",
                    "percentage": "100",
                    "count": 1
                }
            ]
        },
        numOfStats: 1,
        countInTitle: true,
        type: 'circle',
        format: 'count',
        strokeWidth: 18,
        width: 80,
    },
} as ComponentMeta<typeof ReviewStats>;

const Template: ComponentStory<typeof ReviewStats> = (args) => {
    args.stats.reviews = getStats(args.numOfStats);

    return (
        <ReviewStats {...args} />
    );
}


export const circle = Template.bind({});
circle.decorators = [
    (Story) => (
        <div style={{ width: "80px" }}>
            <Story />
        </div>
    ),
]

export const summarized = Template.bind({});
summarized.args = {
    width: 30,
    strokeWidth: 16,
    countInTitle: false
}
summarized.decorators = [
    (Story) => (
        <div style={{ width: "30px" }}>
            <Story />
        </div>
    ),
]

export const line = Template.bind({});
line.args = {
    type: 'line',
    format: 'percentage'
};
