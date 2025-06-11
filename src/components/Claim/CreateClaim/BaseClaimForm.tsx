import React, { useState } from "react";
import {
    FormControl,
    FormLabel,
    Checkbox,
    Grid,
    FormHelperText,
} from "@mui/material";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import colors from "../../../styles/colors";
import AletheiaCaptcha from "../../AletheiaCaptcha";
import Input from "../../AletheiaInput";
import Button, { ButtonType } from "../../Button";
import DatePickerInput from "../../Form/DatePickerInput";
import SourceInput from "../../Source/SourceInput";

interface BaseClaimFormProps {
    content?: React.ReactNode;
    handleSubmit: (values: any) => void;
    disableFutureDates?: boolean;
    isLoading: boolean;
    disclaimer?: string;
    dateExtraText: string;
    errors?: {
        content?: string;
        title?: string;
        date?: string;
        sources?: string[];
    };
    clearError?: (field: "content" | "title" | "date" | "sources") => void;
    recaptcha: string;
    setRecaptcha: (captchaString: string) => void;
    setTitle: (title: string) => void;
    date: string;
    setDate: (date: string) => void;
    setSources: (sources: string[]) => void;
    title: string;
    sources: string[];
}

const BaseClaimForm = ({
    content,
    handleSubmit,
    disableFutureDates,
    isLoading,
    disclaimer,
    dateExtraText,
    errors,
    clearError,
    recaptcha,
    setRecaptcha,
    setTitle,
    date,
    setDate,
    setSources,
    title,
    sources,
}: BaseClaimFormProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [disableSubmit, setDisableSubmit] = useState(true);

    const disabledDate = (current) => {
        return disableFutureDates && current && current > moment().endOf("day");
    };

    const onChangeCaptcha = (captchaString) => {
        setRecaptcha(captchaString);
        const hasRecaptcha = !!captchaString;
        setDisableSubmit(!hasRecaptcha);
    };

    const onFinish = () => {
        const values = {
            title,
            date,
            sources,
            recaptcha,
        };
        handleSubmit(values);
    };

    return (
        <FormControl fullWidth id="createClaim" style={{ padding: "32px 0" }}>
            <FormLabel
                style={{
                    width: "100%",
                }}
            >
                <div className="root-label">
                    <span className="require-label">*</span>
                    <p className="form-label">{t("claimForm:titleField")}</p>
                </div>
                <Input
                    value={title || ""}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        clearError("title");
                    }}
                    placeholder={t("claimForm:titleFieldPlaceholder")}
                    data-cy={"testTitleClaimForm"}
                />
                {errors?.title && (
                    <FormHelperText className="require-label">
                        {errors.title}
                    </FormHelperText>
                )}
            </FormLabel>
            {content}
            <FormLabel
                style={{
                    width: "100%",
                }}
            >
                <div className="root-label">
                    <span className="require-label">*</span>
                    <p className="form-label">{t("claimForm:dateField")}</p>
                </div>
                <DatePickerInput
                    placeholder={t("claimForm:dateFieldPlaceholder")}
                    onChange={(value) => {
                        setDate(value);
                        clearError("date");
                    }}
                    data-cy={"testSelectDate"}
                    disabledDate={disabledDate}
                />
                {errors?.date && (
                    <FormHelperText className="require-label">
                        {errors.date}
                    </FormHelperText>
                )}
                <p className="extra-label">{dateExtraText}</p>
            </FormLabel>
            <SourceInput
                errors={errors}
                clearError={clearError}
                label={t("sourceForm:label")}
                onChange={(e, index) => {
                    setSources(
                        sources.map((source, i) => {
                            return i === index ? e.target.value : source;
                        })
                    );
                }}
                addSource={() => {
                    setSources(sources.concat(""));
                }}
                removeSource={(index) => {
                    setSources(
                        sources.filter((_source, i) => {
                            return i !== index;
                        })
                    );
                }}
                placeholder={t("sourceForm:placeholder")}
                sources={sources}
            />
            {disclaimer && (
                <FormLabel
                    className="form-label"
                    style={{
                        color: colors.error,
                    }}
                >
                    {disclaimer}
                </FormLabel>
            )}
            <FormLabel
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "20px",
                }}
            >
                <Checkbox data-cy={"testCheckboxAcceptTerms"} />
                <p className="form-label">
                    {t("claimForm:checkboxAcceptTerms")}
                </p>
            </FormLabel>
            <FormLabel>
                <AletheiaCaptcha onChange={onChangeCaptcha} />
            </FormLabel>
            <Grid
                container
                style={{
                    justifyContent: "space-evenly",
                    marginBottom: "20px",
                }}
            >
                <Button type={ButtonType.white} onClick={() => router.back()}>
                    {t("claimForm:cancelButton")}
                </Button>
                <Button
                    onClick={onFinish}
                    loading={isLoading}
                    type={ButtonType.blue}
                    htmlType="submit"
                    disabled={disableSubmit || isLoading}
                    data-cy={"testSaveButton"}
                >
                    {t("claimForm:saveButton")}
                </Button>
            </Grid>
        </FormControl>
    );
};

export default BaseClaimForm;
