import { ComponentMeta } from '@storybook/react';
import SourceInput from '../../../components/Source/SourceInput';

export default {
    title: 'Components/Inputs/SourceInput',
    component: SourceInput,
    args: {
        placeholder: 'Placeholder',
        name: 'name',
        label: 'Label',
        sources: [''],
    },
    argTypes: { numOfSources: { control: 'number' } },
} as ComponentMeta<typeof SourceInput>;

const Template = (args) => {
    let sources = [];
    if (args.numOfSources <= 0) {
        sources = ['']
    }
    else {
        for (let i = 0; i < args.numOfSources; i++) {
            sources.push('https://www.google.com/');
        }
    }
    return (<SourceInput {...args} sources={sources} />
    );
}

export const NoSources = Template.bind({});
NoSources.args = {
    numOfSources: 0,
};

export const OneSource = Template.bind({});
OneSource.args = {
    numOfSources: 1,
}

export const TwoSources = Template.bind({});
TwoSources.args = {
    numOfSources: 2,
}
