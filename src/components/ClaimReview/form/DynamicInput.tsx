import { useTranslation } from 'next-i18next';
import React from 'react'
import ClaimReviewSelect from '../../Form/ClaimReviewSelect';
import TextArea from '../../TextArea';
import ClaimReviewUserForm from '../ClaimReviewUserForm';
import InputTextList from '../../InputTextList'

interface DynamicInputProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: any;
    inputType: string;
}

const DynamicInput = (props: DynamicInputProps) => {
    const { t } = useTranslation()
    switch (props.type) {
        case "textArea":
            return (
                <TextArea
                    rows={4}
                    value={props.value}
                    placeholder={t(props.placeholder)}
                    onChange={(value) => props.onChange(value)}
                />
            )
        case "inputSearch":
            return <ClaimReviewUserForm {...props} />
        case "textList":
            return (
                <InputTextList
                    placeholder={t(props.placeholder)}
                    onChange={(value) => props.onChange(value)}
                    type={props.inputType}
                />
            )
        case "select":
            return (
                <ClaimReviewSelect
                    type="select"
                    onChange={(value) => props.onChange(value)}
                    defaultValue=""
                />
            )
        default:
            return null

    }
}

export default DynamicInput
