import { ComponentStory, ComponentMeta } from '@storybook/react';
import SearchOverlay from '../../../components/SearchOverlay';
import ProviderWrapper from '../../ProviderWrapper';

export default {
    title: 'Components/Layout/SearchOverlay',
    component: SearchOverlay,
    args: {
        overlay: {
            results: true,
            search: true
        }
    },
    decorators: [
        (Story) => (<ProviderWrapper><Story /></ProviderWrapper>),
    ]
} as ComponentMeta<typeof SearchOverlay>;

const Template: ComponentStory<typeof SearchOverlay> = (args) => (
    <SearchOverlay {...args} />
);

export const Default = Template.bind({});
Default.args = {};
