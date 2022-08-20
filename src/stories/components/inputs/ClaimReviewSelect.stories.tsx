import { ComponentStory, ComponentMeta } from '@storybook/react';
import ClaimReviewSelect from '../../../components/Form/ClaimReviewSelect';

export default {
    title: 'Components/Inputs/ClaimReviewSelect',
    component: ClaimReviewSelect,
    decorators: [
        (Story) => (
            <div style={{ width: '500px' }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof ClaimReviewSelect>;

export const Default: ComponentStory<typeof ClaimReviewSelect> = (args) => (
    <ClaimReviewSelect
        type="select"
        onChange={undefined}
        defaultValue=""
        placeholder={'placeholder'}
    />
);
