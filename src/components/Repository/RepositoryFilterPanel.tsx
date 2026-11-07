import React, { useCallback } from "react";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import personalityApi from "../../api/personality";
import TopicsApi from "../../api/topicsApi";
import { currentNameSpace } from "../../atoms/namespace";
import reviewColors from "../../constants/reviewColors";
import colors from "../../styles/colors";
import DateRangePicker from "../DateRangePicker";
import AsyncOptionFilter from "./AsyncOptionFilter";
import {
    METHODOLOGY_IDS,
    MethodologyId,
    classificationMethodologies,
    getMethodology,
    isAllowedClassification,
    toMethodologyLanguage,
} from "../../../lib/classification-methodology";
import {
    CONTENT_MODELS,
    NamedOption,
    RepositoryFilters,
    RepositoryTab,
    ReviewStatus,
} from "./repositoryFilters";

const FilterSection = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <Box component="section" sx={{ mt: 3 }}>
        <Typography
            component="h3"
            sx={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: colors.blackSecondary,
                mb: 1,
            }}
        >
            {title}
        </Typography>
        {children}
    </Box>
);

// app.css paints every ToggleButton dark; only the selected one is here.
const toggleButton = "& button.MuiButtonBase-root.MuiToggleButton-root";
const toggleGroupSx = {
    width: "100%",
    [toggleButton]: {
        flex: 1,
        textTransform: "none",
        fontWeight: 600,
        borderWidth: 1,
        background: colors.white,
        color: colors.primary,
    },
    [`${toggleButton}.Mui-selected, ${toggleButton}.Mui-selected:hover`]: {
        background: colors.primary,
        color: colors.white,
    },
};

const toggle = (list: string[], value: string) =>
    list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];

interface RepositoryFilterPanelProps {
    tab: RepositoryTab;
    filters: RepositoryFilters;
    contentModelCounts: Record<string, number>;
    onChange: (changes: Partial<RepositoryFilters>) => void;
    onClear: () => void;
}

const RepositoryFilterPanel = ({
    tab,
    filters,
    contentModelCounts,
    onChange,
    onClear,
}: RepositoryFilterPanelProps) => {
    const { t, i18n } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const lang = toMethodologyLanguage(i18n.language);
    const isClaims = tab === "claims";

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

    const handleMethodologyChange = (methodology: MethodologyId | null) =>
        onChange({
            methodology,
            // Keep only the labels the new methodology offers
            classification: methodology
                ? filters.classification.filter((value) =>
                      isAllowedClassification(methodology, value)
                  )
                : filters.classification,
        });

    return (
        <Box data-cy="testRepositoryFilters">
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: 20,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <FilterListIcon fontSize="small" />
                    {t("repository:filters")}
                </Typography>
                <Button
                    size="small"
                    onClick={onClear}
                    sx={{ textTransform: "none", color: colors.lightPrimary }}
                    data-cy="testRepositoryClearFilters"
                >
                    {t("repository:clearFilters")}
                </Button>
            </Box>

            <FilterSection title={t("repository:personality")}>
                <AsyncOptionFilter
                    value={filters.personality}
                    onChange={(personality) => onChange({ personality })}
                    fetchOptions={fetchPersonalities}
                    placeholder={t("repository:allPersonalities")}
                    dataCy="testRepositoryPersonalityFilter"
                />
            </FilterSection>

            {!isClaims && (
                <>
                    <FilterSection title={t("repository:methodology")}>
                        <ToggleButtonGroup
                            exclusive
                            size="small"
                            value={filters.methodology}
                            onChange={(_event, value) =>
                                handleMethodologyChange(value)
                            }
                            sx={toggleGroupSx}
                        >
                            {METHODOLOGY_IDS.map((id) => (
                                <ToggleButton key={id} value={id}>
                                    {classificationMethodologies[id].name[lang]}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </FilterSection>

                    <FilterSection title={t("repository:classification")}>
                        {getMethodology(filters.methodology).options.map(
                            (option) => (
                                <FormControlLabel
                                    key={option.value}
                                    sx={{ display: "flex", mr: 0 }}
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={filters.classification.includes(
                                                option.value
                                            )}
                                            onChange={() =>
                                                onChange({
                                                    classification: toggle(
                                                        filters.classification,
                                                        option.value
                                                    ),
                                                })
                                            }
                                        />
                                    }
                                    label={
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <Box
                                                component="span"
                                                sx={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: "50%",
                                                    backgroundColor:
                                                        reviewColors[
                                                            option.value
                                                        ],
                                                }}
                                            />
                                            {option.label[lang]}
                                        </Box>
                                    }
                                />
                            )
                        )}
                    </FilterSection>
                </>
            )}

            <FilterSection title={t("repository:contentType")}>
                {CONTENT_MODELS.map((contentModel) => (
                    <FormControlLabel
                        key={contentModel}
                        sx={{
                            display: "flex",
                            mr: 0,
                            "& .MuiFormControlLabel-label": { flex: 1 },
                        }}
                        control={
                            <Checkbox
                                size="small"
                                checked={filters.contentModel.includes(
                                    contentModel
                                )}
                                onChange={() =>
                                    onChange({
                                        contentModel: toggle(
                                            filters.contentModel,
                                            contentModel
                                        ),
                                    })
                                }
                            />
                        }
                        label={
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                {t(`repository:contentModel.${contentModel}`)}
                                <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{ color: colors.neutralSecondary }}
                                >
                                    {contentModelCounts[contentModel] || 0}
                                </Typography>
                            </Box>
                        }
                    />
                ))}
            </FilterSection>

            {isClaims && (
                <FilterSection title={t("repository:reviewStatus")}>
                    <ToggleButtonGroup
                        exclusive
                        size="small"
                        value={filters.reviewStatus}
                        onChange={(_event, value: ReviewStatus | null) =>
                            value && onChange({ reviewStatus: value })
                        }
                        sx={toggleGroupSx}
                    >
                        <ToggleButton value="all">
                            {t("repository:reviewStatusAll")}
                        </ToggleButton>
                        <ToggleButton value="with">
                            {t("repository:reviewStatusWith")}
                        </ToggleButton>
                        <ToggleButton value="without">
                            {t("repository:reviewStatusWithout")}
                        </ToggleButton>
                    </ToggleButtonGroup>
                </FilterSection>
            )}

            <FilterSection title={t("repository:topic")}>
                <AsyncOptionFilter
                    value={filters.topic}
                    onChange={(topic) => onChange({ topic })}
                    fetchOptions={fetchTopics}
                    placeholder={t("repository:allTopics")}
                    dataCy="testRepositoryTopicFilter"
                />
            </FilterSection>

            <FilterSection
                title={t(
                    isClaims ? "repository:claimDate" : "repository:reviewDate"
                )}
            >
                <DateRangePicker
                    vertical
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    setStartDate={(startDate: Date | null) =>
                        onChange({ startDate })
                    }
                    setEndDate={(endDate: Date | null) => onChange({ endDate })}
                />
            </FilterSection>
        </Box>
    );
};

export default RepositoryFilterPanel;
