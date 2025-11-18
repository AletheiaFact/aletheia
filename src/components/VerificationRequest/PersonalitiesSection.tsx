import React from "react";
import Link from "next/link";
import {
    Box,
    Typography,
    Chip,
    Stack,
    Card,
    Skeleton,
    Avatar,
    Button,
    Alert,
} from "@mui/material";
import {
    Person,
    InfoOutlined,
    ErrorOutline,
    Refresh,
} from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import type { PersonalityWithWikidata } from "../../types/PersonalityWithWikidata";
import colors from "../../styles/colors";

interface PersonalitiesSectionProps {
    personalities: PersonalityWithWikidata[];
    isLoading: boolean;
    error: Error | null;
    expectedCount: number;
    onRetry: () => void;
}

interface PersonalityCardProps {
    personality: PersonalityWithWikidata;
}

const PersonalityCard: React.FC<PersonalityCardProps> = ({ personality }) => {
    const { t } = useTranslation();
    const personalityUrl = `/personality/${personality.slug}`;

    const cardContent = (
        <Card
            sx={{
                display: "flex",
                alignItems: "center",
                padding: "12px 16px",
                backgroundColor: colors.white,
                border: `1px solid ${colors.neutralTertiary}`,
                borderRadius: "8px",
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
                textDecoration: "none",
                "&:hover": {
                    borderColor: colors.primary,
                    boxShadow: `0 2px 8px ${colors.shadow}`,
                    transform: "translateY(-2px)",
                },
                "&:focus-visible": {
                    outline: `2px solid ${colors.lightPrimary}`,
                    outlineOffset: "2px",
                },
            }}
        >
            <Avatar
                src={personality.avatar || undefined}
                alt={personality.name}
                sx={{
                    width: 56,
                    height: 56,
                    marginRight: 2,
                    border: `2px solid ${colors.lightPrimary}`,
                }}
            >
                {!personality.avatar && <Person fontSize="large" />}
            </Avatar>
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                }}
            >
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 600,
                        fontSize: "15px",
                        color: colors.black,
                        marginBottom: "4px",
                    }}
                >
                    {personality.name}
                </Typography>
                {personality.description && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 0.5,
                        }}
                    >
                        <InfoOutlined
                            sx={{
                                fontSize: "14px",
                                color: colors.secondary,
                                marginTop: "2px",
                            }}
                        />
                        <Typography
                            variant="caption"
                            sx={{
                                color: colors.secondary,
                                fontSize: "12px",
                                lineHeight: "1.4",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {personality.description}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Card>
    );

    return (
        <Link
            href={personalityUrl}
            style={{ textDecoration: "none" }}
            aria-label={t("verificationRequest:viewPersonalityPage", {
                name: personality.name,
            })}
        >
            {cardContent}
        </Link>
    );
};

const PersonalitiesSection: React.FC<PersonalitiesSectionProps> = ({
    personalities,
    isLoading,
    error,
    expectedCount,
    onRetry,
}) => {
    const { t } = useTranslation();

    const renderContent = () => {
        if (error) {
            return (
                <Alert
                    severity="error"
                    icon={<ErrorOutline />}
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            startIcon={<Refresh />}
                            onClick={onRetry}
                            aria-label={t(
                                "verificationRequest:retryLoadingPersonalities"
                            )}
                        >
                            {t("verificationRequest:retryLoadingPersonalities")}
                        </Button>
                    }
                >
                    {t("verificationRequest:errorLoadingPersonalities")}
                </Alert>
            );
        }

        if (isLoading) {
            return (
                <output aria-live="polite">
                    <Stack spacing={2}>
                        {Array.from({ length: expectedCount }).map(
                            (_, index) => (
                                <Card
                                    key={`skeleton-${index}`}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "12px 16px",
                                        backgroundColor: colors.white,
                                        border: `1px solid ${colors.neutralTertiary}`,
                                        borderRadius: "8px",
                                    }}
                                >
                                    <Skeleton
                                        variant="circular"
                                        width={56}
                                        height={56}
                                        sx={{ marginRight: 2 }}
                                    />
                                    <Box
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                        }}
                                    >
                                        <Skeleton
                                            variant="text"
                                            width="60%"
                                            height={24}
                                            sx={{ marginBottom: "4px" }}
                                        />
                                        <Skeleton
                                            variant="text"
                                            width="40%"
                                            height={16}
                                        />
                                    </Box>
                                </Card>
                            )
                        )}
                    </Stack>
                </output>
            );
        }

        if (personalities.length === 0) {
            return (
                <Alert severity="info">
                    {t("verificationRequest:noPersonalitiesFound")}
                </Alert>
            );
        }

        return (
            <Stack
                spacing={2}
                component="ul"
                sx={{ listStyle: "none", padding: 0, margin: 0 }}
            >
                {personalities.map((personality) => (
                    <Box component="li" key={personality.personalityId}>
                        <PersonalityCard personality={personality} />
                    </Box>
                ))}
            </Stack>
        );
    };

    return (
        <Box
            style={{
                marginTop: "24px",
            }}
        >
            <Box
                style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "16px",
                }}
            >
                <Person
                    style={{
                        fontSize: "20px",
                        marginRight: "8px",
                        color: colors.primary,
                    }}
                    aria-hidden="true"
                />
                <Typography
                    variant="h6"
                    component="h2"
                    style={{
                        fontFamily: "initial",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: colors.black,
                    }}
                    id="personalities-heading"
                >
                    {t("verificationRequest:identifiedPersonalities")}
                </Typography>
                {!isLoading && !error && personalities.length > 0 && (
                    <Chip
                        label={personalities.length}
                        size="small"
                        style={{
                            marginLeft: "8px",
                            backgroundColor: colors.primary,
                            color: colors.white,
                            fontWeight: "bold",
                            height: "20px",
                            fontSize: "11px",
                        }}
                        aria-label={`${personalities.length} personalities found`}
                    />
                )}
            </Box>
            <div aria-labelledby="personalities-heading">{renderContent()}</div>
        </Box>
    );
};

export default PersonalitiesSection;
