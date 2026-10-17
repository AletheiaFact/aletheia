import React, { useState } from "react";
import { FormControl, FormLabel, Checkbox, Grid, FormHelperText, Box, Typography } from "@mui/material";
import { LinkOutlined } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";

import colors from "../../../styles/colors";
import AletheiaCaptcha from "../../AletheiaCaptcha";
import Input from "../../AletheiaInput";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import DatePickerInput from "../../Form/DatePickerInput";
import SourceInput from "../../Source/SourceInput";
import WarningModal from "../../Modal/WarningModal";
import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import { ContentModelEnum } from "../../../types/enums";

interface BaseClaimFormProps {
    variant: ContentModelEnum;
    content?: React.ReactNode;
    handleSubmit: (values: any) => void;
    isLoading: boolean;
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
    isDirty?: boolean;
}

const FormSection = ({
    title,
    description,
    divider = true,
    children,
}: {
    title: string;
    description: string;
    divider?: boolean;
    children: React.ReactNode;
}) => (
    <Box
        component="section"
        sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            padding: "20px 0",
            borderTop: divider ? `1px solid ${colors.lightNeutralSecondary}` : "none",
        }}
    >
        <div>
            <Typography
                variant="h2"
                sx={{ fontSize: 22, fontWeight: 700, color: colors.blackSecondary, margin: 0 }}
            >
                {title}
            </Typography>
            <Typography sx={{ fontSize: 14, color: colors.black, marginTop: "4px" }}>
                {description}
            </Typography>
        </div>
        {children}
    </Box>
);

const BaseClaimForm = ({
    variant,
    content,
    handleSubmit,
    isLoading,
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
    isDirty = false,
}: BaseClaimFormProps) => {
    const { t } = useTranslation();
    const [, send] = useAtom(createClaimMachineAtom);
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [showDiscardWarning, setShowDiscardWarning] = useState(false);

    const goBack = () => send({ type: CreateClaimEvents.back });

    const onClickBack = () => {
        if (isDirty) {
            setShowDiscardWarning(true);
        } else {
            goBack();
        }
    };
    const copy = (key: string) => t(`claimForm:createForm.${variant}.${key}`);

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
        <FormControl
            fullWidth
            id="createClaim"
            style={{ padding: "8px 0 32px" }}
        >
            <FormSection
                title={copy("sectionTitle")}
                description={copy("sectionDescription")}
                divider={false}
            >
                <FormLabel style={{ width: "100%" }}>
                    <div className="root-label">
                        <span className="require-label">*</span>
                        <p className="form-label">
                            {t("claimForm:titleField")}
                        </p>
                    </div>
                    <Input
                        value={title || ""}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            clearError("title");
                        }}
                        placeholder={copy("titlePlaceholder")}
                        data-cy={"testTitleClaimForm"}
                    />
                    {errors?.title && (
                        <FormHelperText className="require-label">
                            {errors.title}
                        </FormHelperText>
                    )}
                    <p className="extra-label">
                        {t("claimForm:createForm.titleHelp")}
                    </p>
                </FormLabel>
                {content}
                <FormLabel style={{ width: "100%" }}>
                    <div className="root-label">
                        <span className="require-label">*</span>
                        <p className="form-label">
                            {t("claimForm:dateField")}
                        </p>
                    </div>
                    <Box sx={{ maxWidth: 280 }}>
                        <DatePickerInput
                            placeholder={t("claimForm:dateFieldPlaceholder")}
                            onChange={(value) => {
                                setDate(value);
                                clearError("date");
                            }}
                            dataCy="testSelectDate"
                        />
                    </Box>
                    {errors?.date && (
                        <FormHelperText className="require-label">
                            {errors.date}
                        </FormHelperText>
                    )}
                    <p className="extra-label">
                        {copy("dateHelp")}
                    </p>
                </FormLabel>
            </FormSection>

            <FormSection
                title={t("claimForm:createForm.sourceTitle")}
                description={copy("sourceDescription")}
            >
                <Box
                    role="note"
                    data-cy="sourceGuidance"
                    sx={{
                        border: `1px solid ${colors.primary}`,
                        borderRadius: "8px",
                        padding: "12px 16px",
                    }}
                >
                    <Typography
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: colors.primary,
                        }}
                    >
                        <LinkOutlined aria-hidden="true" sx={{ fontSize: 18 }} />
                        {t("claimForm:createForm.sourceGuidanceTitle")}
                    </Typography>
                    <Typography sx={{ fontSize: 14, color: colors.black, marginTop: "4px" }}>
                        {copy("sourceGuidance")}
                    </Typography>
                </Box>
                <div>
                    <SourceInput
                        errors={errors}
                        clearError={clearError}
                        label={copy("sourceLabel")}
                        helpText={copy("sourceHelp")}
                        addSourceLabel={t("claimForm:createForm.addSource")}
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
                </div>
            </FormSection>

            <FormSection
                title={t("claimForm:createForm.publishTitle")}
                description={copy("publishDescription")}
            >
                <p className="form-label" style={{ color: colors.error }}>
                    {copy("disclaimer")}
                </p>
                <FormLabel style={{ display: "flex", alignItems: "center" }}>
                    <Checkbox data-cy={"testCheckboxAcceptTerms"} />
                    <p className="form-label">{t("claimForm:checkboxAcceptTerms")}</p>
                </FormLabel>
                <FormLabel>
                    <AletheiaCaptcha onChange={onChangeCaptcha} />
                </FormLabel>
            </FormSection>

            <Grid container
                style={{
                    justifyContent: "space-between",
                    gap: "12px",
                    paddingTop: "20px",
                    borderTop: `1px solid ${colors.lightNeutralSecondary}`,
                }}
            >
                <AletheiaButton
                    type={ButtonType.whiteBlack}
                    onClick={onClickBack}
                >
                    {t("claimForm:createForm.backButton")}
                </AletheiaButton>
                <AletheiaButton
                    onClick={onFinish}
                    loading={isLoading}
                    type={ButtonType.primary}
                    htmlType="submit"
                    disabled={disableSubmit || isLoading}
                    data-cy={"testSaveButton"}
                >
                    {copy("publishButton")}
                </AletheiaButton>
            </Grid>
            <WarningModal
                open={showDiscardWarning}
                title={t("warningModal:title", {
                    warning: t("claimForm:createForm.discardWarning"),
                })}
                width={400}
                handleOk={goBack}
                handleCancel={() => setShowDiscardWarning(false)}
            />
        </FormControl>
    );
};

export default BaseClaimForm;
