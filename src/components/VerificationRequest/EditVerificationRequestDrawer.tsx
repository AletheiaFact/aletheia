import React, { useEffect, useState } from "react";
import { VerificationRequest } from "../../types/VerificationRequest";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import createVerificationRequestForm from "./CreateVerificationRequest/fieldLists/CreateVerificationRequestForm";
import DynamicForm from "../Form/DynamicForm";
import AletheiaButton, { ButtonType } from "../Button";
import { Box, Divider, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import verificationRequestApi from "../../api/verificationRequestApi";
import AletheiaInput from "../AletheiaInput";
import LargeDrawer from "../LargeDrawer";

interface EditVerificationRequestDrawerProps {
    open: boolean;
    onClose: () => void;
    verificationRequest;
    onSave: (updatedRequest: VerificationRequest) => void;
}

const useExtraSources = (initialSources: string[] = []) => {
    const [extraSources, setExtraSources] = useState<string[]>(initialSources);

    const addSource = () => setExtraSources([...extraSources, ""]);
    const removeSource = (indexToRemove: number) => {
        setExtraSources(extraSources.filter((source, index) => index !== indexToRemove));
    };
    const updateSource = (index: number, value: string) => {
        const newSources = [...extraSources];
        newSources[index] = value;
        setExtraSources(newSources);
    };

    return { extraSources, addSource, removeSource, updateSource };
}

const EditVerificationRequestModal: React.FC<EditVerificationRequestDrawerProps> = ({
    open,
    onClose,
    verificationRequest,
    onSave,
}) => {
    const { t } = useTranslation();
    const [isSubmit, setIsSubmit] = useState(false);
    const { extraSources, addSource, removeSource, updateSource } = useExtraSources([]);

    const { handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: {
            content: "",
            publicationDate: "",
            date: "",
            heardFrom: "",
            source: [],
        }
    });

    useEffect(() => {
        if (open && verificationRequest) {
            reset({
                content: verificationRequest.content,
                publicationDate: verificationRequest.publicationDate,
                date: verificationRequest.date,
                heardFrom: verificationRequest.heardFrom,
                source: verificationRequest.source || [],
            });
        }
    }, [open, verificationRequest, reset]);

    const getEditableFields = (verificationRequest) => {
        const editableFields = new Set(["publicationDate", "source"]);

        return createVerificationRequestForm.map((field) => {
            if (field.fieldName === "source") {
                const hasExistingSource = verificationRequest?.source?.length > 0;
                return { ...field, disabled: hasExistingSource, rules: {} };
            }
            return { ...field, disabled: !editableFields.has(field.fieldName) };
        }).filter(field => field.fieldName !== "email");
    };

    const formFields = getEditableFields(verificationRequest);

    const formatExistingSources = (sources) =>
        Array.isArray(sources)
            ? sources
                .map(src => {
                    if (typeof src === "object" && src._id) {
                        const originalSource = verificationRequest.source?.find(existingSource => existingSource._id === src._id);
                        return originalSource?.href ? { href: originalSource.href } : null;
                    }
                    return null;
                })
                .filter(src => src?.href)
            : [];

    const formatNewSources = (sources: string[]) =>
        sources.filter(src => src.trim() !== "").map(src => ({ href: src }));

    const onSubmit = async (data) => {
        setIsSubmit(true);
        try {
            const existing = formatExistingSources(data.source);
            const newSources = formatNewSources(extraSources);
            const allSources = [...existing, ...newSources];
            const validSources = allSources.filter(src => src.href?.trim());

            const updateData = {
                publicationDate: data.publicationDate,
                source: validSources,
            };

            const response = await verificationRequestApi.editingVerificationRequest(
                verificationRequest._id,
                updateData,
                t
            );

            if (response) {
                onSave(response);
                onClose();
            }
        } catch (error) {
            console.error("Edit Verification Request error", error)
        } finally {
            setIsSubmit(false);
        }
    };

    const machineValues = verificationRequest ? {
        content: verificationRequest.content || "",
        publicationDate: verificationRequest.publicationDate || "",
        heardFrom: verificationRequest.heardFrom || "",
        source: Array.isArray(verificationRequest.source) && verificationRequest.source.length > 0
            ? verificationRequest.source[0]?.href || ""
            : "",
        date: verificationRequest.date || "",
    } : {};

    return (
        <LargeDrawer open={open} onClose={onClose}>
            <Grid container style={{ padding: "20px" }}>
                <Grid item>
                    <h2>
                        {t("verificationRequest:titleEditVerificationRequest")}
                    </h2>
                    <Divider />
                </Grid>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    style={{
                        width: "100%",
                        marginTop: 16,
                        overflowX: "hidden",
                    }}>
                    <DynamicForm
                        currentForm={formFields}
                        control={control}
                        errors={errors}
                        machineValues={machineValues}
                    />

                    {extraSources.map((source, index) => (
                        <Box
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginTop: "10px"
                            }}
                        >
                            <AletheiaInput
                                value={source}
                                onChange={(e) => updateSource(index, e.target.value)}
                                placeholder={t("verificationRequest:sourcePlaceholder")}
                            />
                            <AletheiaButton
                                onClick={() => removeSource(index)}
                                style={{ minWidth: "auto", padding: "8px" }}
                            >
                                <DeleteIcon />
                            </AletheiaButton>
                        </Box>
                    ))}

                    <AletheiaButton
                        type={ButtonType.blue}
                        style={{ marginTop: "10px" }}
                        onClick={addSource}
                    >
                        <AddIcon />
                    </AletheiaButton>

                    <Box style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "15px" }}>
                        <AletheiaButton
                            type={ButtonType.blue}
                            htmlType="submit"
                            disabled={isSubmit}
                            data-cy={"testAlertModalButton"}
                        >
                            {t("admin:saveButtonLabel")}
                        </AletheiaButton>
                        <AletheiaButton
                            type={ButtonType.white}
                            onClick={onClose}
                            disabled={isSubmit}
                            data-cy={"testAlertModalButton"}
                        >
                            {t("orderModal:cancelButton")}
                        </AletheiaButton>
                    </Box>
                </form>
            </Grid>
        </LargeDrawer>
    )
};

export default EditVerificationRequestModal;