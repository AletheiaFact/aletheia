import { useState } from "react";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import { validateUrl } from "../../../utils/ValidateUrl";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import { useTranslation } from "next-i18next";

export const useBaseClaimForm = (options?: { shouldValidateContent?: boolean }) => {
    const { shouldValidateContent = true } = options || {};
    const { t } = useTranslation();
    const router = useRouter();
    const [, send] = useAtom(createClaimMachineAtom);
    const [isLoading, setIsLoading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [errors, setErrors] = useState({
        content: "",
        title: "",
        date: "",
        sources: [] as string[],
    });
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [sources, setSources] = useState([""]);
    const [recaptcha, setRecaptcha] = useState("");

    const clearError = (field) => {
        if (errors?.[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validateFields = () => {
        const newErrors: any = {};
        const newSourceErrors = sources.map((src) => {
            return validateUrl(src, t);
        });

        if (!title.trim()) newErrors.title = t("claimForm:titleFieldError");
        if (shouldValidateContent && !content.trim()) newErrors.content = t("claimForm:contentFieldError");
        if (!date) newErrors.date = t("claimForm:dateFieldError");
        if (newSourceErrors.some(msg => msg)) newErrors.sources = newSourceErrors;

        return newErrors;
    };


    const handleSubmit = (values) => {
        const newErrors = validateFields();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (!isLoading) {
            setIsLoading(true);
            send({
                type: CreateClaimEvents.persist,
                claimData: content ? { ...values, content } : values,
                t,
                router,
            });
            setIsLoading(false);
        }
    };

    return {
        t,
        handleSubmit,
        content,
        setContent,
        title,
        setTitle,
        date,
        setDate,
        sources,
        setSources,
        recaptcha,
        setRecaptcha,
        isLoading,
        setIsLoading,
        imageError,
        setImageError,
        errors,
        setErrors,
        clearError,
        validateFields,
    };
};
