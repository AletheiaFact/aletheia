import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CircularProgress,
    Link,
    Chip,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import ReleaseNotesApi, { GitHubRelease } from "../../api/releaseNotesApi";
import colors from "../../styles/colors";

const ReleaseNotes = () => {
    const { t } = useTranslation();
    const [releases, setReleases] = useState<GitHubRelease[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReleases = async () => {
            try {
                const data = await ReleaseNotesApi.getLatestReleases(10);
                setReleases(data);
            } catch (error) {
                console.error("Error fetching releases:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReleases();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ marginTop: "2rem" }}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="400px"
                >
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ marginTop: "2rem", marginBottom: "2rem" }}>
            <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                    fontWeight: "bold",
                    color: colors.primary,
                    marginBottom: "1.5rem",
                }}
            >
                {t("releaseNotes:title")}
            </Typography>

            <Typography
                variant="body1"
                sx={{ marginBottom: "2rem", color: colors.blackSecondary }}
            >
                {t("releaseNotes:description")}
            </Typography>

            {releases.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: "center", marginTop: "2rem" }}>
                    {t("releaseNotes:noReleases")}
                </Typography>
            ) : (
                releases.map((release) => (
                    <Card
                        key={release.id}
                        sx={{
                            marginBottom: "2rem",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                    >
                        <CardContent>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                marginBottom="1rem"
                            >
                                <Box>
                                    <Typography
                                        variant="h5"
                                        component="h2"
                                        sx={{
                                            fontWeight: "bold",
                                            color: colors.primary,
                                        }}
                                    >
                                        {release.name || release.tag_name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{ color: colors.blackSecondary }}
                                    >
                                        {formatDate(release.published_at)}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={release.tag_name}
                                    size="small"
                                    sx={{
                                        backgroundColor: colors.lightTertiary,
                                        color: colors.primary,
                                    }}
                                />
                            </Box>

                            <Box
                                sx={{
                                    "& h1, & h2, & h3, & h4, & h5, & h6": {
                                        marginTop: "1rem",
                                        marginBottom: "0.5rem",
                                        fontWeight: "bold",
                                    },
                                    "& ul, & ol": {
                                        paddingLeft: "1.5rem",
                                        marginBottom: "1rem",
                                    },
                                    "& p": {
                                        marginBottom: "1rem",
                                    },
                                    "& code": {
                                        backgroundColor: colors.lightNeutral,
                                        padding: "0.2rem 0.4rem",
                                        borderRadius: "4px",
                                        fontSize: "0.9em",
                                    },
                                    "& pre": {
                                        backgroundColor: colors.lightNeutral,
                                        padding: "1rem",
                                        borderRadius: "4px",
                                        overflow: "auto",
                                        marginBottom: "1rem",
                                    },
                                    "& a": {
                                        color: colors.primary,
                                        textDecoration: "none",
                                        "&:hover": {
                                            textDecoration: "underline",
                                        },
                                    },
                                }}
                            >
                                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                    {release.body}
                                </ReactMarkdown>
                            </Box>

                            <Link
                                href={release.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    display: "block",
                                    marginTop: "1rem",
                                    color: colors.primary,
                                    textDecoration: "none",
                                    "&:hover": {
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                {t("releaseNotes:viewOnGitHub")}
                            </Link>
                        </CardContent>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default ReleaseNotes;
