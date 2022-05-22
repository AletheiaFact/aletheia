import { ComponentStory, ComponentMeta } from '@storybook/react';
import Sidebar from '../../../components/Sidebar';
import ProviderWrapper from '../../ProviderWrapper';

export default {
    title: 'Components/Layout/Sidebar',
    component: Sidebar,
    args: {
        menuCollapsed: false,
    },
    argTypes: {
        menuCollapsed: {
            control: { type: 'boolean' },
        }
    },
    decorators: [
        (Story) => (<ProviderWrapper><Story /></ProviderWrapper>),
    ]
} as ComponentMeta<typeof Sidebar>;

const Template: ComponentStory<typeof Sidebar> = (args) => (
    <Sidebar {...args} />
);

export const Default = Template.bind({});
Default.args = {
    menuCollapsed: false,
};
