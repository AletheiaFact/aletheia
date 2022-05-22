import { ComponentMeta } from '@storybook/react';
import ClaimSentence from '../../../components/Claim/ClaimSentence';
import { classifications } from '../../fixtures';

export default {
    title: 'Components/Claim/ClaimSentence',
    component: ClaimSentence,
    args: {
        showHighlights: true,
        classification: "true",
        properties: {
            "id": 1,
            "topClassification": {
                "classification": "true",
                "count": 1
            }
        },
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        generateHref: () => "href",

    },
    argTypes: {
        classification: {
            options: ['none', ...classifications],
            control: {
                type: "select",
            },
        }
    },
} as ComponentMeta<typeof ClaimSentence>;

const Template = (args) => {
    args.properties.topClassification.classification = args.classification
    args.properties.topClassification.count = args.classification === 'none' ? undefined : 1
    return (
        <ClaimSentence {...args} />
    )
};

export const WithHighlights = Template.bind({});
WithHighlights.args = {};

export const WithoutHighlights = Template.bind({});
WithoutHighlights.args = {
    showHighlights: false,
    classification: 'none'
}
