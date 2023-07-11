import ClaimReviewSelect from "./ClaimReviewSelect";
import InputTextList from "../InputTextList";
import React from "react";
import TextArea from "../TextArea";
import UserInput from "./UserInput";
import dynamic from "next/dynamic";
import { htmlToText } from "html-to-text";
import { useTranslation } from "next-i18next";

const CollaborativeEditor = dynamic<any>(
    () => import("../Collaborative/CollaborativeEditor"),
    {
        ssr: false,
    }
);

interface DynamicInputProps {
    fieldName: string;
    type: string;
    placeholder: string;
    value: string | [];
    onChange: any;
    addInputLabel: string;
    defaultValue: string | [];
    "data-cy": string;
    extraProps: any;
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
                    defaultValue={htmlToText(props.defaultValue)}
                    data-cy={props["data-cy"]}
                    white="true"
                />
            );
        case "inputSearch":
            return (
                <UserInput
                    placeholder={t(props.placeholder)}
                    onChange={props.onChange}
                    dataCy={props["data-cy"]}
                    dataLoader={props.extraProps.dataLoader}
                    value={props.value}
                    mode={props.extraProps.mode}
                    preloadedOptions={props.extraProps.preloadedOptions}
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
        case "collaborative":
            return (
                <CollaborativeEditor
                    placeholder={t(props.placeholder)}
                    onContentChange={({ doc }) =>
                        props.onChange(doc?.textContent)
                    }
                />
            );
        default:
            return null;
    }
};

export default DynamicInput;
