import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import PersonalityCreateSearch from "../Personality/PersonalityCreateSearch";
import verificationRequestApi, {
    ResolveUnmatchedResponse,
} from "../../api/verificationRequestApi";
import { ActionTypes } from "../../store/types";

type UnmatchedName = { name: string; wikidataCandidate?: string };

type ResolveBody =
    | { action: "link"; name: string; personalityId: string }
    | { action: "dismiss"; name: string };

interface Props {
    verificationRequestId: string;
    unmatched: UnmatchedName[];
    canResolve: boolean;
    onResolved: (updated: ResolveUnmatchedResponse) => void;
}

const UnmatchedPersonalitiesSection = ({
    verificationRequestId,
    unmatched,
    canResolve,
    onResolved,
}: Props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [linking, setLinking] = useState<string | null>(null);
    const [pendingName, setPendingName] = useState<string | null>(null);

    if (!unmatched?.length) return null;

    // The search box and its results live in the shared redux store, so clear
    // them whenever the dialog opens or closes; otherwise a previous search's
    // results could be linked to the wrong name.
    const resetSearch = () => {
        dispatch({
            type: ActionTypes.SEARCH_PERSONALITIES_RESULTS,
            searchPersonalitiesResults: [],
        });
        dispatch({ type: ActionTypes.SET_SEARCH_NAME, searchName: "" });
    };

    const openLink = (name: string) => {
        resetSearch();
        setLinking(name);
    };

    const closeLink = () => {
        resetSearch();
        setLinking(null);
    };

    const resolve = async (body: ResolveBody) => {
        if (pendingName) return;
        setPendingName(body.name);
        try {
            const updated =
                await verificationRequestApi.resolveUnmatchedPersonality(
                    verificationRequestId,
                    body,
                    t
                );
            closeLink();
            onResolved(updated);
        } catch {
            // The API layer already showed the error message.
        } finally {
            setPendingName(null);
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
                <Grid
                    key={name}
                    container
                    alignItems="center"
                    gap={1}
                    data-cy="unmatchedRow"
                    data-name={name}
                >
                    <Typography variant="body2" style={{ flex: 1 }}>
                        {name}
                        {wikidataCandidate ? ` (${wikidataCandidate})` : ""}
                    </Typography>
                    {canResolve && (
                        <>
                            <Button
                                size="small"
                                onClick={() => openLink(name)}
                                disabled={pendingName === name}
                                data-cy="unmatchedLink"
                            >
                                {t("verificationRequest:unmatchedLink")}
                            </Button>
                            <Button
                                size="small"
                                onClick={() =>
                                    resolve({ action: "dismiss", name })
                                }
                                disabled={pendingName === name}
                                data-cy="unmatchedDismiss"
                            >
                                {t("verificationRequest:unmatchedDismiss")}
                            </Button>
                        </>
                    )}
                </Grid>
            ))}
            <Dialog open={!!linking} onClose={closeLink} fullWidth>
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
                <DialogActions>
                    <Button onClick={closeLink} data-cy="unmatchedLinkCancel">
                        {t("personality:editCancel")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};

export default UnmatchedPersonalitiesSection;
