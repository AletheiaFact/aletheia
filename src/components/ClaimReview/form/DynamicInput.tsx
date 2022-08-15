import { useTranslation } from "next-i18next";
import React from "react";
import ClaimReviewSelect from "../../Form/ClaimReviewSelect";
import TextArea from "../../TextArea";
import AutoComplete from "../Autocomplete";
import InputTextList from "../../InputTextList";

interface DynamicInputProps {
    fieldName: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: any;
    addInputLabel: string;
    defaultValue: string | [];
    "data-cy": string;
    dataLoader: any;
}

const DynamicInput = (props: DynamicInputProps) => {
    const { t } = useTranslation();
    switch (props.type) {
        case "textArea":
            return (
                <TextArea
                    rows={4}
                    placeholder={t(props.placeholder)}
                    onChange={(value) => props.onChange(value)}
                    defaultValue={props.defaultValue}
                    data-cy={props["data-cy"]}
                    white="true"
                />
            );
        case "inputSearch":
            return (
                <AutoComplete
                    placeholder={t(props.placeholder)}
                    onChange={props.onChange}
                    dataCy={props["data-cy"]}
                    dataLoader={props.dataLoader}
                />
            );
        case "textList":
            return (
                <InputTextList
                    fieldName={props.fieldName}
                    placeholder={t(props.placeholder)}
                    onChange={(value) => props.onChange(value)}
                    addInputLabel={t(props.addInputLabel)}
                    defaultValue={props.defaultValue}
                    dataCy={props["data-cy"]}
                    white="true"
                />
            );
        case "select":
            return (
                <ClaimReviewSelect
                    type="select"
                    onChange={(value) => props.onChange(value)}
                    defaultValue={props.defaultValue}
                    placeholder={t(props.placeholder)}
                />
            );
        default:
            return null;
    }
};

export default DynamicInput;
