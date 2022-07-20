import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import SocialMediaShare from '../../../components/SocialMediaShare';

export default {
    title: 'Components/Buttons/SocialMediaShare',
    component: SocialMediaShare,
} as ComponentMeta<typeof SocialMediaShare>;

export const Default: ComponentStory<typeof SocialMediaShare> = () => (
    <SocialMediaShare isLoggedIn={"isLoggedIn"} />
);
