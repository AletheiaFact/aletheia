import React, { useState } from "react";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import TextArea from "../../TextArea";
import BaseClaimForm from "./BaseClaimForm";
import { FormControl, FormHelperText } from "@mui/material";
import { URL_PATTERN } from "../../../utils/ValidateFloatingLink";

const ClaimCreate = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [content, setContent] = useState("");
    const [_, send] = useAtom(createClaimMachineAtom);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        content: "",
        title: "",
        date: "",
        sources: [] as string[],
    });
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [sources, setSources] = useState([""]);
    const [recaptcha, setRecaptcha] = useState("");

    const clearError = (field) => {
        if (errors?.[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleSubmit = (values) => {
        const newErrors: any = {};
        const newSourceErrors = sources.map((src) => {
            const trimSrc = src.trim();
            if (!trimSrc) return t("common:requiredFieldError");
            if (!URL_PATTERN.test(trimSrc)) return t("sourceForm:errorMessageValidURL");
            return "";
        });

        if (!title.trim()) newErrors.title = t("claimForm:titleFieldError");
        if (!content.trim()) newErrors.content = t("claimForm:contentFieldError");
        if (!date) newErrors.date = t("claimForm:dateFieldError");
        if (newSourceErrors.some(msg => msg)) newErrors.sources = newSourceErrors;

        if (Object.keys(newErrors).length > 0) {
            setErrors?.(newErrors);
            return;
        }
        if (!isLoading) {
            setIsLoading(true);
            const claim = { ...values, content };
            send({
                type: CreateClaimEvents.persist,
                claimData: claim,
                t,
                router,
            });
            setIsLoading(false);
        }
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
        <BaseClaimForm
            handleSubmit={handleSubmit}
            disableFutureDates
            isLoading={isLoading}
            disclaimer={t("claimForm:disclaimer")}
            dateExtraText={t("claimForm:dateFieldHelp")}
            errors={errors}
            clearError={clearError}
            setRecaptcha={setRecaptcha}
            setTitle={setTitle}
            setDate={setDate}
            setSources={setSources}
            title={title}
            sources={sources}
            onFinish={onFinish}
            content={
                <FormControl
                    style={{
                        width: "100%",
                        marginTop: "24px",
                    }}
                >
                    <div className="root-label">
                        <span className="require-label">*</span>
                        <p className="form-label">{t("claimForm:contentField")}</p>
                    </div>
                    <TextArea
                        multiline
                        value={content || ""}
                        onChange={(e) => {
                            setContent(e.target.value);
                            clearError("content");
                        }}
                        placeholder={t("claimForm:contentFieldPlaceholder")}
                        data-cy={"testContentClaim"}
                    />
                    {errors.content && (
                        <FormHelperText className="require-label">
                            {errors.content}
                        </FormHelperText>
                    )}
                    <p className="extra-label">{t("claimForm:contentFieldHelp")}</p>
                </FormControl>
            }
        />
    );
};

export default ClaimCreate;