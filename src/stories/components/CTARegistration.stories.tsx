import { ComponentStory, ComponentMeta } from '@storybook/react';
import CTARegistration from '../../components/Home/CTAFolder';

export default {
    title: 'Components/CTARegistration',
    component: CTARegistration,
} as ComponentMeta<typeof CTARegistration>;

export const Default: ComponentStory<typeof CTARegistration> = () => (
    <CTARegistration />
);
