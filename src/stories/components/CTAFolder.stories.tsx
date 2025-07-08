import { Meta, StoryObj } from '@storybook/react';
import CTAFolder from '../../components/Home/CTAFolder';

export default {
    title: 'Components/CTAFolder',
    component: CTAFolder,
} as Meta<typeof CTAFolder>;

export const Default: StoryObj<typeof CTAFolder> = {
    render: () => <CTAFolder />,
};
