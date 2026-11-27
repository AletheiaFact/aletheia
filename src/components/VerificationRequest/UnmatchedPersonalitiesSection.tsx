import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import PersonalityCreateSearch from "../Personality/PersonalityCreateSearch";
import verificationRequestApi from "../../api/verificationRequestApi";

type UnmatchedName = { name: string; wikidataCandidate?: string };

type ResolveBody =
    | { action: "link"; name: string; personalityId: string }
    | { action: "dismiss"; name: string };

interface Props {
    verificationRequestId: string;
    unmatched: UnmatchedName[];
    canResolve: boolean;
    onResolved: (updated: any) => void;
}

const UnmatchedPersonalitiesSection = ({
    verificationRequestId,
    unmatched,
    canResolve,
    onResolved,
}: Props) => {
    const { t } = useTranslation();
    const [linking, setLinking] = useState<string | null>(null);

    if (!unmatched?.length) return null;

    const resolve = async (body: ResolveBody) => {
        try {
            const updated =
                await verificationRequestApi.resolveUnmatchedPersonality(
                    verificationRequestId,
                    body,
                    t
                );
            setLinking(null);
            onResolved(updated);
        } catch {
            // The API layer already showed the error message.
        }
    };

    return (
        <Grid
            container
            direction="column"
            gap={1}
            data-cy="unmatchedPersonalities"
        >
            <Typography variant="subtitle2">
                {t("verificationRequest:unmatchedTitle")}
            </Typography>
            {unmatched.map(({ name, wikidataCandidate }) => (
                <Grid key={name} container alignItems="center" gap={1}>
                    <Typography variant="body2" style={{ flex: 1 }}>
                        {name}
                        {wikidataCandidate ? ` (${wikidataCandidate})` : ""}
                    </Typography>
                    {canResolve && (
                        <>
                            <Button
                                size="small"
                                onClick={() => setLinking(name)}
                                data-cy={`unmatchedLink-${name}`}
                            >
                                {t("verificationRequest:unmatchedLink")}
                            </Button>
                            <Button
                                size="small"
                                onClick={() =>
                                    resolve({ action: "dismiss", name })
                                }
                                data-cy={`unmatchedDismiss-${name}`}
                            >
                                {t("verificationRequest:unmatchedDismiss")}
                            </Button>
                        </>
                    )}
                </Grid>
            ))}
            <Dialog open={!!linking} onClose={() => setLinking(null)} fullWidth>
                <DialogTitle>
                    {t("verificationRequest:unmatchedLinkTitle", {
                        name: linking,
                    })}
                </DialogTitle>
                <DialogContent>
                    {linking && (
                        <PersonalityCreateSearch
                            withSuggestions
                            selectPersonality={(personality) =>
                                resolve({
                                    action: "link",
                                    name: linking,
                                    personalityId: personality._id,
                                })
                            }
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Grid>
    );
};

export default UnmatchedPersonalitiesSection;
