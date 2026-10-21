import { Grid, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import AletheiaAlert from "../AletheiaAlert";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import Loading from "../Loading";

interface ConsentSummary {
    clientName: string;
    scopes: string[];
}

const consentUrl = (challenge: string) =>
    `/api/mcp/oauth/consent/${encodeURIComponent(challenge)}`;

const McpConsent = ({ challenge }: { challenge: string }) => {
    const { t } = useTranslation();
    const [summary, setSummary] = useState<ConsentSummary>();
    const [failed, setFailed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!challenge) {
            setFailed(true);
            return;
        }
        fetch(consentUrl(challenge), { credentials: "include" })
            .then((response) => {
                if (response.status === 401) {
                    // Signed out: log in, then come back to this page.
                    window.location.href = `/login?return_to=${encodeURIComponent(
                        window.location.href
                    )}`;
                    return null;
                }
                return response.ok ? response.json() : Promise.reject();
            })
            .then((data) => data && setSummary(data))
            .catch(() => setFailed(true));
    }, [challenge]);

    const decide = (decision: "accept" | "reject") => {
        setIsSubmitting(true);
        fetch(consentUrl(challenge), {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ decision }),
        })
            .then((response) =>
                response.ok ? response.json() : Promise.reject()
            )
            .then(({ redirectTo }) => {
                window.location.href = redirectTo;
            })
            .catch(() => {
                setFailed(true);
                setIsSubmitting(false);
            });
    };

    if (failed) {
        return (
            <Grid container justifyContent="center" style={{ padding: 20 }}>
                <AletheiaAlert
                    type="error"
                    message={t("mcpConsent:failedMessage")}
                />
            </Grid>
        );
    }

    if (!summary) return <Loading />;

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            gap={2}
            style={{ padding: 20 }}
        >
            <Typography variant="h4" component="h1">
                {t("mcpConsent:title", { client: summary.clientName })}
            </Typography>
            <Typography>{t("mcpConsent:scopesIntro")}</Typography>
            <ul>
                {summary.scopes.map((scope) => (
                    <li key={scope}>{scope}</li>
                ))}
            </ul>
            <Grid container justifyContent="center" gap={2}>
                <AletheiaButton
                    type={ButtonType.outline}
                    disabled={isSubmitting}
                    onClick={() => decide("reject")}
                >
                    {t("mcpConsent:deny")}
                </AletheiaButton>
                <AletheiaButton
                    type={ButtonType.primary}
                    loading={isSubmitting}
                    onClick={() => decide("accept")}
                >
                    {t("mcpConsent:allow")}
                </AletheiaButton>
            </Grid>
        </Grid>
    );
};

export default McpConsent;
