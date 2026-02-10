import React, { useState } from "react";
import { Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "next-i18next";
import AletheiaButton, { ButtonType } from "../../../Button";
import AletheiaInput from "../../../AletheiaInput";
import { IInputExtraSourcesList } from "../../../../types/VerificationRequest";
import { SourceType } from "../../../../types/Source";

const formatSources = (sources: SourceType[]) => {
    const sourceArray = Array.isArray(sources) ? sources : [];
    if (sourceArray.length === 0) return [createEmptySource()];

    return sourceArray.map((source) => ({
        id: source._id,
        href: typeof source === "object" ? source.href : source || "",
        isNewSource: !!(typeof source === "object" ? source.href : source),
    }));
};

const createEmptySource = () => ({
    id: Math.random().toString(),
    href: "",
    isNewSource: false
});

const InputExtraSourcesList = ({ sources, onChange, disabled, placeholder }: IInputExtraSourcesList) => {
    const { t } = useTranslation();
    const [sourcesList, setSourcesList] = useState(() => formatSources(sources as SourceType[]));

    const handleSubmit = (hrefsList: typeof sourcesList) => {
        const updatedHrefs = [...new Set(hrefsList.map(source => source.href.trim()).filter(Boolean))];
        onChange(updatedHrefs);
    };

    const updateSources = (id: string, newHref: string) => {
        const newHrefList = sourcesList.map(source => source.id === id ? { ...source, href: newHref } : source);
        setSourcesList(newHrefList);
        handleSubmit(newHrefList);
    };

    const addField = () => {
        if (disabled) return;
        const newHrefList = [...sourcesList, createEmptySource()];
        setSourcesList(newHrefList);
        handleSubmit(newHrefList);
    };

    const removeField = (id: string, index: number) => {
        if (disabled || index === 0) return;
        const newHrefList = sourcesList.filter((source) => source.id !== id);

        setSourcesList(newHrefList);
        handleSubmit(newHrefList);
    };

    return (
        <Grid container justifyContent="center">
            {sourcesList.map((source, index) => (
                <Grid item
                    key={source.id}
                    style={{
                        display: "flex",
                        width: "100%",
                        gap: 12,
                        marginTop: 12
                    }}
                >
                    <AletheiaInput
                        value={source.href}
                        disabled={disabled || (index === 0 && source.isNewSource)}
                        onChange={(newHref) => updateSources(source.id, newHref.target.value)}
                        placeholder={t(placeholder)}
                        white="true"
                    />

                    {!disabled && index !== 0 && (
                        <AletheiaButton
                            onClick={() => removeField(source.id, index)}
                            style={{ minWidth: "40px" }}
                        >
                            <DeleteIcon fontSize="small" />
                        </AletheiaButton>
                    )}
                </Grid>
            ))}

            {!disabled && (
                <Grid item>
                    <AletheiaButton
                        type={ButtonType.blue}
                        onClick={addField}
                        style={{ marginTop: 12 }}
                    >
                        <AddIcon fontSize="small" />
                        {t("sourceForm:addNewSourceButton")}
                    </AletheiaButton>
                </Grid>
            )}
        </Grid>
    );
};

export default InputExtraSourcesList;
