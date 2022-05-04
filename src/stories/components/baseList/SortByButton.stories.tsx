import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import SortByButton from '../../../components/List/SortByButton';


export default {
    title: 'Components/BaseList/SortByButton',
    component: SortByButton,
} as ComponentMeta<typeof SortByButton>;

export const Default: ComponentStory<typeof SortByButton> = () => (
    <SortByButton refreshListItems={undefined} />
);
