import React, { Suspense, lazy, useContext } from "react";

import ClaimReviewSelect from "./ClaimReviewSelect";
import InputTextList from "../InputTextList";
import Loading from "../Loading";
import TextArea from "../TextArea";
import UserInput from "./UserInput";
import { useTranslation } from "next-i18next";
import { CollaborativeEditorContext } from "../Collaborative/CollaborativeEditorProvider";
import AletheiaInput from "../AletheiaInput";

const VisualEditor = lazy(() => import("../Collaborative/CollaborativeEditor"));

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
    const { isFetchingEditor } = useContext(CollaborativeEditorContext);

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
                <UserInput
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
