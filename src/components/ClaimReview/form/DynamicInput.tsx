import { useTranslation } from "next-i18next";
import React from "react";
import ClaimReviewSelect from "../../Form/ClaimReviewSelect";
import TextArea from "../../TextArea";
import UserAutocomplete from "../UserAutocomplete";
import InputTextList from "../../InputTextList";

interface DynamicInputProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: any;
    addInputLabel: string;
    defaultValue: string | [];
    "data-cy": string;
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
                <UserAutocomplete
                    placeholder={t(props.placeholder)}
                    onChange={props.onChange}
                    dataCy={props["data-cy"]}
                />
            );
        case "textList":
            return (
                <InputTextList
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
