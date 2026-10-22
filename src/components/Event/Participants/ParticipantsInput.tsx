import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import EditOutlined from "@mui/icons-material/EditOutlined";
import { useTranslation } from "next-i18next";
import colors from "../../../styles/colors";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import AletheiaInput from "../../AletheiaInput";
import ImageUpload from "../../ImageUpload";
import { Organization } from "../../../types/Organization";
import LogoThumb from "./LogoThumb";
import OrganizationSearch from "./OrganizationSearch";
import {
    createEmptyDraft,
    draftFromOrganization,
    moveDraft,
    ParticipantDraft,
} from "./participantDrafts";

interface ParticipantsInputProps {
    defaultValue?: ParticipantDraft[];
    onChange: (drafts: ParticipantDraft[]) => void;
    disabled?: boolean;
    dataCy: string;
}

const ParticipantsInput = ({
    defaultValue,
    onChange,
    disabled,
    dataCy,
}: ParticipantsInputProps) => {
    const { t } = useTranslation();
    const [drafts, setDrafts] = useState<ParticipantDraft[]>(
        () => defaultValue ?? []
    );
    const [editingKey, setEditingKey] = useState<string | null>(null);

    const commit = (next: ParticipantDraft[]) => {
        setDrafts(next);
        onChange(next);
    };

    const updateDraft = (key: string, changes: Partial<ParticipantDraft>) =>
        commit(
            drafts.map((draft) =>
                draft.key === key ? { ...draft, ...changes } : draft
            )
        );

    const addOrganization = (organization: Organization) =>
        commit([...drafts, draftFromOrganization(organization)]);

    const addNewOrganization = () => {
        const draft = createEmptyDraft();
        commit([...drafts, draft]);
        setEditingKey(draft.key);
    };

    const removeDraft = (key: string) => {
        commit(drafts.filter((draft) => draft.key !== key));
        if (editingKey === key) setEditingKey(null);
    };

    const selectedIds = drafts
        .map(({ organization }) => organization?._id)
        .filter(Boolean);

    return (
        <Box display="flex" flexDirection="column" gap="12px" width="100%">
            {drafts.length === 0 && (
                <Typography variant="body2" color={colors.blackSecondary}>
                    {t("events:participantsEmpty")}
                </Typography>
            )}

            <Box
                component="ol"
                sx={{ listStyle: "none", m: 0, p: 0 }}
                display="flex"
                flexDirection="column"
                gap="8px"
            >
                {drafts.map((draft, index) => {
                    const isEditing = editingKey === draft.key;
                    const label =
                        draft.name.trim() || t("events:organizationUnnamed");

                    return (
                        <Box
                            component="li"
                            key={draft.key}
                            data-cy={`${dataCy}-row-${index}`}
                            sx={{
                                border: `1px solid ${colors.lightNeutralSecondary}`,
                                borderRadius: "8px",
                                background: colors.white,
                                p: "8px 12px",
                            }}
                        >
                            <Box display="flex" alignItems="center" gap="12px">
                                <LogoThumb logo={draft.logo[0]} />
                                <Box flex="1" minWidth={0}>
                                    <Typography fontWeight={600} noWrap>
                                        {label}
                                    </Typography>
                                    {draft.website.trim() && (
                                        <Typography
                                            variant="body2"
                                            color={colors.blackSecondary}
                                            noWrap
                                        >
                                            {draft.website.trim()}
                                        </Typography>
                                    )}
                                </Box>
                                {!disabled && (
                                    <Box display="flex" flex="none">
                                        <IconButton
                                            aria-label={t(
                                                "events:organizationEdit",
                                                { name: label }
                                            )}
                                            aria-expanded={isEditing}
                                            onClick={() =>
                                                setEditingKey(
                                                    isEditing ? null : draft.key
                                                )
                                            }
                                            data-cy={`${dataCy}Edit-${index}`}
                                        >
                                            <EditOutlined fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            aria-label={t(
                                                "events:participantMoveUp"
                                            )}
                                            disabled={index === 0}
                                            onClick={() =>
                                                commit(
                                                    moveDraft(drafts, index, -1)
                                                )
                                            }
                                            data-cy={`${dataCy}Up-${index}`}
                                        >
                                            <ArrowUpward fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            aria-label={t(
                                                "events:participantMoveDown"
                                            )}
                                            disabled={
                                                index === drafts.length - 1
                                            }
                                            onClick={() =>
                                                commit(
                                                    moveDraft(drafts, index, 1)
                                                )
                                            }
                                            data-cy={`${dataCy}Down-${index}`}
                                        >
                                            <ArrowDownward fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            aria-label={t(
                                                "events:participantRemove",
                                                { name: label }
                                            )}
                                            onClick={() =>
                                                removeDraft(draft.key)
                                            }
                                            data-cy={`${dataCy}Remove-${index}`}
                                        >
                                            <DeleteOutline fontSize="small" />
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>

                            {isEditing && (
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    gap="8px"
                                    mt="12px"
                                >
                                    {draft.organization && (
                                        <Typography
                                            variant="body2"
                                            color={colors.blackSecondary}
                                        >
                                            {t(
                                                "events:organizationSharedNotice"
                                            )}
                                        </Typography>
                                    )}
                                    <AletheiaInput
                                        value={draft.name}
                                        aria-label={t(
                                            "events:organizationName"
                                        )}
                                        placeholder={t(
                                            "events:organizationName"
                                        )}
                                        onChange={(event) =>
                                            updateDraft(draft.key, {
                                                name: event.target.value,
                                            })
                                        }
                                        data-cy={`${dataCy}Name-${index}`}
                                        white="true"
                                    />
                                    <AletheiaInput
                                        value={draft.website}
                                        type="url"
                                        aria-label={t(
                                            "events:organizationWebsite"
                                        )}
                                        placeholder={t(
                                            "events:organizationWebsite"
                                        )}
                                        onChange={(event) =>
                                            updateDraft(draft.key, {
                                                website: event.target.value,
                                            })
                                        }
                                        data-cy={`${dataCy}Website-${index}`}
                                        white="true"
                                    />
                                    <ImageUpload
                                        defaultFileList={draft.logo}
                                        onChange={(logo) =>
                                            updateDraft(draft.key, { logo })
                                        }
                                        dataCy={`${dataCy}Logo-${index}`}
                                    />
                                    <AletheiaButton
                                        type={ButtonType.primary}
                                        onClick={() => setEditingKey(null)}
                                        style={{ alignSelf: "flex-start" }}
                                        data-cy={`${dataCy}Done-${index}`}
                                    >
                                        {t("events:organizationDone")}
                                    </AletheiaButton>
                                </Box>
                            )}
                        </Box>
                    );
                })}
            </Box>

            {!disabled && (
                <Box display="flex" flexWrap="wrap" gap="12px">
                    <OrganizationSearch
                        excludeIds={selectedIds}
                        onSelect={addOrganization}
                        dataCy={dataCy}
                    />
                    <AletheiaButton
                        type={ButtonType.primary}
                        onClick={addNewOrganization}
                        data-cy={`${dataCy}-addNew`}
                    >
                        <AddIcon fontSize="small" />
                        {t("events:createOrganization")}
                    </AletheiaButton>
                </Box>
            )}
        </Box>
    );
};

export default ParticipantsInput;
