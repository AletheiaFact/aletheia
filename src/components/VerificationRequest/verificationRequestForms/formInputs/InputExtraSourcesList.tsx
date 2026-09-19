import React, { useCallback, useMemo, useState } from "react";
import { Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "next-i18next";
import AletheiaButton, { ButtonType } from "../../../AletheiaButton";
import AletheiaInput from "../../../AletheiaInput";
import { IInputExtraSourcesList } from "../../../../types/VerificationRequest";
import { SourceType } from "../../../../types/Source";
import { debounce } from "lodash";

const formatSources = (sources: SourceType[]) => {
    const sourceArray = Array.isArray(sources) ? sources : [];
    if (sourceArray.length === 0) return [createEmptySource()];

    return sourceArray.map((source) => ({
        id: Math.random().toString(),
        href: typeof source === "object" ? source.href : source || "",
        isNewSource: !!(typeof source === "object" ? source.href : source),
    }));
};

const createEmptySource = () => ({
    id: Math.random().toString(),
    href: "",
    isNewSource: false
});

const InputExtraSourcesList = ({ defaultSources, onChange, disabled, placeholder, dataCy }: IInputExtraSourcesList) => {
    const { t } = useTranslation();
    const [sourcesList, setSourcesList] = useState(() => formatSources(defaultSources as SourceType[]));

    const handleListChange = useCallback((newSourcesList: typeof sourcesList) => {
        const cleanedSources = [...new Set(newSourcesList.map(source => source.href.trim()).filter(Boolean))];
        onChange(cleanedSources);
    }, [onChange]);

    const debouncedOnChange = useMemo(
        () =>
            debounce((SourcesList: typeof sourcesList) => {
                handleListChange(SourcesList)
            }, 800),
        [handleListChange]
    );

    const updateSources = (id: string, newHref: string) => {
        const newSourcesList = sourcesList.map(source => source.id === id ? { ...source, href: newHref } : source);
        setSourcesList(newSourcesList);
        debouncedOnChange(newSourcesList)
    };

    const addField = () => {
        if (disabled) return;
        const newSourcesList = [...sourcesList, createEmptySource()];
        setSourcesList(newSourcesList);
    };

    const removeField = (id: string, index: number) => {
        if (disabled || index === 0) return;
        const newSourcesList = sourcesList.filter((source) => source.id !== id);

        setSourcesList(newSourcesList);
        debouncedOnChange.cancel();

        handleListChange(newSourcesList)
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
                        data-cy={`${dataCy}Edit-${index}`}
                        white="true"
                    />

                    {!disabled && index !== 0 && (
                        <AletheiaButton
                            onClick={() => removeField(source.id, index)}
                            data-cy={`${dataCy}Remove-${index}`}
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
                        type={ButtonType.primary}
                        onClick={addField}
                        data-cy={`${dataCy}-addSources`}
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
