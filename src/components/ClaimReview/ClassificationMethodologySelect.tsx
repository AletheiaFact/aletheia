import React, { useContext, useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useTranslation } from "next-i18next";
import ReviewTaskApi from "../../api/reviewTaskApi";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import {
    METHODOLOGY_IDS,
    classificationMethodologies,
    resolveMethodologyId,
    toMethodologyLanguage,
} from "../../../lib/classification-methodology";

const ClassificationMethodologySelect = () => {
    const { t, i18n } = useTranslation();
    const { classificationMethodology, setClassificationMethodology } =
        useContext(ReviewTaskMachineContext);
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        let active = true;
        ReviewTaskApi.getClassificationMethodologySettings().then(
            (settings) => active && setEnabled(settings.enabled)
        );
        return () => {
            active = false;
        };
    }, []);

    if (!enabled || !setClassificationMethodology) {
        return null;
    }

    const lang = toMethodologyLanguage(i18n.language);

    return (
        <FormControl size="small" style={{ minWidth: 220 }}>
            <InputLabel id="classification-methodology-label">
                {t("claimReviewForm:methodologyPickerLabel")}
            </InputLabel>
            <Select
                labelId="classification-methodology-label"
                label={t("claimReviewForm:methodologyPickerLabel")}
                value={resolveMethodologyId(classificationMethodology)}
                onChange={(event) =>
                    setClassificationMethodology(String(event.target.value))
                }
                data-cy="testClassificationMethodologySelect"
            >
                {METHODOLOGY_IDS.map((id) => (
                    <MenuItem
                        key={id}
                        value={id}
                        data-cy={`testMethodology-${id}`}
                    >
                        {classificationMethodologies[id].name[lang]}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default ClassificationMethodologySelect;
