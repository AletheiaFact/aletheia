import { ComponentStory, ComponentMeta } from '@storybook/react';
import ClaimReviewCard from '../../../components/ClaimReview/ClaimReviewCard';
import { classifications } from '../../fixtures';

export default {
    title: 'Components/Claim/ClaimReviewCard',
    component: ClaimReviewCard,
    args: {
        classification: "true",
        sources: [
            {
                _id: "625ddaea59797548449973e2",
                link: "https://www.lipsum.com/",
                targetModel: "ClaimReview",
            }
        ],
        report: "Lorem Ipsum is simply dummy text of the printing and typesetting industry"
    },
    argTypes: {
        classification: {
            options: classifications,
            control: {
                type: "select",
            },
        }
    },
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof ClaimReviewCard>;

const Template: ComponentStory<typeof ClaimReviewCard> = (args) => (
    <ClaimReviewCard {...args} />
);

export const Default = Template.bind({});
Default.args = {};
