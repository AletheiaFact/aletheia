import { ComponentStory, ComponentMeta } from '@storybook/react';
import CTAFolder from '../../components/Home/CTAFolder';

export default {
    title: 'Components/CTAFolder',
    component: CTAFolder,
} as ComponentMeta<typeof CTAFolder>;

export const Default: ComponentStory<typeof CTAFolder> = () => (
    <CTAFolder />
);
