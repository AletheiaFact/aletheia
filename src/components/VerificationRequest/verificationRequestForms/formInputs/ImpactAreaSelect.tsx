import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import TopicsApi from "../../../../api/topicsApi";
import { IImpactAreaSelect, ImpactAreaOption } from "../../../../types/Topic";
import OptionsSelect from "./OptionsSelect";

/**
 * Select for the closed list of impact areas of a verification request.
 * Emits the area slug. A default area outside the list (set before the list
 * was closed) is still shown, so editing an old request keeps its value.
 */
const ImpactAreaSelect = ({
    onChange,
    defaultValue,
    placeholder,
    isDisabled,
    dataCy,
}: IImpactAreaSelect) => {
    const { t } = useTranslation();
    const defaultArea =
        defaultValue && typeof defaultValue === "object" && "slug" in defaultValue
            ? { name: defaultValue.name, slug: defaultValue.slug }
            : null;
    const [areas, setAreas] = useState<ImpactAreaOption[]>([]);

    useEffect(() => {
        TopicsApi.getImpactAreas(t)
            .then(setAreas)
            .catch(() => setAreas([]));
    }, [t]);

    const isDefaultInList = areas.some((area) => area.slug === defaultArea?.slug);
    const options = (
        defaultArea && !isDefaultInList ? [...areas, defaultArea] : areas
    ).map((area) => ({ value: area.slug, label: area.name }));

    return (
        <OptionsSelect
            options={options}
            onChange={onChange}
            defaultValue={defaultArea?.slug}
            placeholder={placeholder}
            isDisabled={isDisabled}
            dataCy={dataCy}
        />
    );
};

export default ImpactAreaSelect;
