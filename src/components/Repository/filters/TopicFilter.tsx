import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import TopicsApi from "../../../api/topicsApi";
import { toMethodologyLanguage } from "../../../../lib/classification-methodology";
import AsyncOptionFilter from "../AsyncOptionFilter";
import FilterSection from "./FilterSection";
import { NamedOption } from "../repositoryFilters";

interface TopicFilterProps {
    value: NamedOption | null;
    onChange: (topic: NamedOption | null) => void;
}

const TopicFilter = ({ value, onChange }: TopicFilterProps) => {
    const { t, i18n } = useTranslation();
    const lang = toMethodologyLanguage(i18n.language);

    const fetchTopics = useCallback(
        async (query: string): Promise<NamedOption[]> => {
            const topics = await TopicsApi.searchTopics({
                query,
                limit: 10,
                language: lang,
                t,
            });
            return (topics || []).map((topic) => ({
                id: topic._id,
                name: topic.name,
            }));
        },
        [lang, t]
    );

    return (
        <FilterSection
            title={t("repository:topic")}
            collapsible
            defaultOpen={!!value}
        >
            <AsyncOptionFilter
                value={value}
                onChange={onChange}
                fetchOptions={fetchTopics}
                placeholder={t("repository:allTopics")}
                dataCy="testRepositoryTopicFilter"
            />
        </FilterSection>
    );
};

export default TopicFilter;
