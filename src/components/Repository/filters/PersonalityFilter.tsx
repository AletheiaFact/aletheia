import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import personalityApi from "../../../api/personality";
import { currentNameSpace } from "../../../atoms/namespace";
import AsyncOptionFilter from "../AsyncOptionFilter";
import FilterSection from "./FilterSection";
import { NamedOption } from "../repositoryFilters";

interface PersonalityFilterProps {
    value: NamedOption | null;
    onChange: (personality: NamedOption | null) => void;
}

const PersonalityFilter = ({ value, onChange }: PersonalityFilterProps) => {
    const { t, i18n } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);

    const fetchPersonalities = useCallback(
        async (searchName: string): Promise<NamedOption[]> => {
            const response = await personalityApi.getPersonalities(
                { searchName, pageSize: 10, fetchOnly: true, i18n, nameSpace },
                () => undefined
            );
            return (response?.data || []).map((personality) => ({
                id: personality._id,
                name: personality.name,
            }));
        },
        [i18n, nameSpace]
    );

    return (
        <FilterSection title={t("repository:personality")}>
            <AsyncOptionFilter
                value={value}
                onChange={onChange}
                fetchOptions={fetchPersonalities}
                placeholder={t("repository:allPersonalities")}
                dataCy="testRepositoryPersonalityFilter"
            />
        </FilterSection>
    );
};

export default PersonalityFilter;
