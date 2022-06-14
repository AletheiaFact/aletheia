import { useTranslation } from 'next-i18next';
import React from 'react'
import ClaimReviewSelect from '../../Form/ClaimReviewSelect';
import TextArea from '../../TextArea';
import UserAutocomplete from '../UserAutocomplete';
import InputTextList from '../../InputTextList'

interface DynamicInputProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: any;
    inputType: string;
    addInputLabel: string;
    defaultValue: any;
}

const DynamicInput = (props: DynamicInputProps) => {
    const { t } = useTranslation()
    switch (props.type) {
        case "textArea":
            return (
                <TextArea
                    rows={4}
                    placeholder={t(props.placeholder)}
                    onChange={(value) => props.onChange(value)}
                    defaultValue={props.defaultValue}
                />
            )
        case "inputSearch":
            return <UserAutocomplete
                placeholder={t(props.placeholder)}
                onChange={props.onChange}
            />
        case "textList":
            return (
                <InputTextList
                    placeholder={t(props.placeholder)}
                    onChange={(value) => props.onChange(value)}
                    inputType={props.inputType}
                    addInputLabel={t(props.addInputLabel)}
                    defaultValue={props.defaultValue}
                />
            )
        case "select":
            return (
                <ClaimReviewSelect
                    type="select"
                    onChange={(value) => props.onChange(value)}
                    defaultValue={props.defaultValue}
                    placeholder={t(props.placeholder)}
                />
            )
        default:
            return null

    }
}

export default DynamicInput
