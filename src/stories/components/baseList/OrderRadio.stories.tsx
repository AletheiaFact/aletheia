import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import OrderRadio from '../../../components/Radio/OrderRadio';

export default {
    title: 'Components/BaseList/OrderRadio',
    component: OrderRadio,
} as ComponentMeta<typeof OrderRadio>;

const Template: ComponentStory<typeof OrderRadio> = (args) => (
    <OrderRadio {...args} />
);

export const Asc = Template.bind({});
Asc.args = {
    value: 'asc',
};

export const Desc = Template.bind({});
Desc.args = {
    value: 'desc',
};
