import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import OrderModal from '../../../components/Modal/OrderModal';

export default {
    title: 'Components/BaseList/OrderModal',
    component: OrderModal,
    args: {
        visible: true,
    },
} as ComponentMeta<typeof OrderModal>;

const Template: ComponentStory<typeof OrderModal> = (args) => (
    <OrderModal {...args} />
);

export const Asc = Template.bind({});
Asc.args = {
    value: 'asc',
};

export const Desc = Template.bind({});
Desc.args = {
    value: 'desc',
};
