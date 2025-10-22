import React, { Suspense, lazy, useContext } from "react";

import ClaimReviewSelect from "./ClaimReviewSelect";
import InputTextList from "../InputTextList";
import Loading from "../Loading";
import TextArea from "../TextArea";
import FetchInput from "./FetchInput";
import { useTranslation } from "next-i18next";
import { VisualEditorContext } from "../Collaborative/VisualEditorProvider";
import AletheiaInput from "../AletheiaInput";
import DatePickerInput from "./DatePickerInput";
import { Checkbox, FormControlLabel } from "@mui/material";
import ReportTypeSelect from "../VerificationRequest/CreateVerificationRequest/ReportTypeSelect";
import ImpactAreaSelect from "../VerificationRequest/CreateVerificationRequest/ImpactAreaSelect";

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
    disabledDate?: any;
    disabled?: boolean;
}

const DynamicInput = (props: DynamicInputProps) => {
    const { isFetchingEditor } = useContext(VisualEditorContext);

    const { t } = useTranslation();
    switch (props.type) {
        case "textArea":
            return (
                <TextArea
                    multiline
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
                    isMultiple={props.extraProps.mode}
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
                    disabled={props.disabled}
                    style={{ backgroundColor: props.disabled ? colors.lightNeutral : colors.white }}
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
        case "selectReportType":
            return (
                <ReportTypeSelect
                    defaultValue={props.defaultValue}
                    onChange={(value) => props.onChange(value)}
                    placeholder={t(props.placeholder)}

                />
            );
        case "selectImpactArea":
            return (
                <ImpactAreaSelect
                    onChange={(value) => props.onChange(value)}
                    placeholder={t(props.placeholder)}
                />
            );
        case "textbox":
            return (
                <FormControlLabel
                    control={
                        <Checkbox
                            data-cy={props["data-cy"]}
                            defaultChecked={!!props.defaultValue}
                            onChange={(value) => props.onChange(value)}
                            checked={!!props.value}
                        />
                    }
                    label=
                    {t(`claimReviewForm:${props.fieldName}`)}
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
        case "date":
            return (
                <DatePickerInput
                    placeholder={t(props.placeholder)}
                    onChange={(value) => props.onChange(value)}
                    data-cy={"testSelectDate"}
                    disabledDate={props.disabledDate}
                    disabled={props.disabled}
                    style={{ backgroundColor: props.disabled ? colors.lightNeutral : colors.white }}
                />
            );
        case "email":
            return (
                <AletheiaInput
                    placeholder={t(props.placeholder)}
                    type={props.type}
                    onChange={(value) => props.onChange(value)}
                    defaultValue={props.defaultValue}
                    data-cy={props["data-cy"]}
                    white="true"
                />
            );
        default:
            return null;
    }
};

export default DynamicInput;
