import React, { Suspense, lazy, useContext } from "react";

import ClaimReviewSelect from "./ClaimReviewSelect";
import InputTextList from "../InputTextList";
import Loading from "../Loading";
import TextArea from "../TextArea";
import FetchInput from "./FetchInput";
import { useTranslation } from "next-i18next";
import { VisualEditorContext } from "../Collaborative/VisualEditorProvider";
import AletheiaInput from "../AletheiaInput";
import { Checkbox } from "antd";

const VisualEditor = lazy(() => import("../Collaborative/VisualEditor"));

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
    const { isFetchingEditor } = useContext(VisualEditorContext);

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
                <FetchInput
                    fieldName={props.fieldName}
                    placeholder={t(props.placeholder)}
                    onChange={props.onChange}
                    dataCy={props["data-cy"]}
                    dataLoader={props.extraProps.dataLoader}
                    value={props.value}
                    mode={props.extraProps.mode}
                    preloadedOptions={props.extraProps.preloadedOptions}
                />
            );
        case "text":
            return (
                <AletheiaInput
                    placeholder={t(props.placeholder)}
                    onChange={(value) => props.onChange(value)}
                    defaultValue={props.defaultValue}
                    data-cy={props["data-cy"]}
                    white="true"
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
        case "textbox":
            return (
                <Checkbox
                    data-cy={"testCheckboxIsSensitive"}
                    defaultChecked={!!props.defaultValue}
                    onChange={(value) => props.onChange(value)}
                    value={props.value}
                >
                    {t(`claimReviewForm:${props.fieldName}`)}
                </Checkbox>
            );
        case "visualEditor":
            if (isFetchingEditor) {
                return <Loading />;
            } else {
                return (
                    <Suspense fallback={<Loading />}>
                        <VisualEditor
                            onContentChange={({ doc }, reviewTaskType) => {
                                doc.attrs = { reviewTaskType };
                                props.onChange(doc);
                            }}
                        />
                    </Suspense>
                );
            }
        default:
            return null;
    }
};

export default DynamicInput;
