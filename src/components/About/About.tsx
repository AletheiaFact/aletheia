/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTranslation, Trans } from "next-i18next";
import DescriptionIcon from "@mui/icons-material/Description";
import AletheiaAlert from "../AletheiaAlert";
import AletheiaVideo from "../AletheiaVideo";
import colors from "../../styles/colors";

const About = () => {
    const { t } = useTranslation();
    const paragraphStyle = {
        margin: "10px 0",
        width: "100%",
    };

    return (
        <Box
            sx={{
                color: colors.primary,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                fontSize: "1rem",
                letterSpacing: "1px",
                fontWeight: 600,
                padding: "20px",
            }}
        >
            <Box sx={{ padding: "20px 0", width: "100%" }}>
                <AletheiaVideo />
            </Box>
            <AletheiaAlert
                type="info"
                message={
                    <>
                        <p style={{ fontWeight: 600 }}>
                            {t("about:alertInfo")}{" "}
                            <a
                                style={{ whiteSpace: "pre-wrap" }}
                                href="https://github.com/AletheiaFact/aletheia"
                                target="_blank"
                                rel="noreferrer"
                            >
                                https://github.com/AletheiaFact/aletheia
                            </a>
                        </p>
                    </>
                }
                action={
                    <Button
                        style={{ display: "flex", justifySelf: "end" }}
                        variant="contained"
                        size="small"
                        startIcon={<DescriptionIcon />}
                        href="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/AletheiaFact/miscellaneous/290b19847f0da521963f74e7947d7863bf5d5624/documents/org_legal_register.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t("about:labelButton")}
                    </Button>
                }
            />
            <Box sx={{ textAlign: "center", width: "100%" }}>
                <Typography variant="h3">{t("about:title")}</Typography>
            </Box>
            <Box sx={paragraphStyle}>
                <p>{t("about:intro")}</p>
            </Box>
            <Box sx={{ textAlign: "center", width: "100%" }}>
                <Typography variant="h3">{t("about:visionTitle")}</Typography>
            </Box>
            <Box sx={paragraphStyle}>
                <p>{t("about:visionContent")}</p>
            </Box>
            <Box sx={{ textAlign: "center", width: "100%" }}>
                <Typography variant="h3">{t("about:missionTitle")}</Typography>
            </Box>
            <Box sx={paragraphStyle}>
                <p>{t("about:missionContent")}</p>
            </Box>
            <Box sx={{ textAlign: "center", width: "100%" }}>
                <Typography variant="h3">{t("about:valuesTitle")}</Typography>
            </Box>
            <Box sx={paragraphStyle}>
                <ul>
                    <li key={1}>{t("about:valueAccessibility")}</li>
                    <li key={2}>{t("about:valueCredibility")}</li>
                    <li key={3}>{t("about:valueAutonomy")}</li>
                </ul>
            </Box>
            <Box sx={{ textAlign: "center", width: "100%" }}>
                <Typography variant="h3">{t("about:fullTextTitle")}</Typography>
            </Box>
            <Box sx={paragraphStyle}>
                <p>
                    <Trans
                        i18nKey="about:firstParagraph"
                        components={[
                            <a
                                style={{ whiteSpace: "pre-wrap" }}
                                href="https://github.com/AletheiaFact/aletheia"
                                target="_blank"
                                rel="noreferrer"
                            />,
                            <a
                                style={{ whiteSpace: "pre-wrap" }}
                                href="https://builders.mozilla.community/programs.html#open-lab"
                                target="_blank"
                                rel="noreferrer"
                            />,
                        ]}
                    />
                </p>
            </Box>
            <Box sx={paragraphStyle}>
                <p>
                    <Trans
                        i18nKey="about:secondParagraph"
                        components={[
                            <a
                                style={{ whiteSpace: "pre-wrap" }}
                                href="https://wikipedia.org"
                                target="_blank"
                                rel="noreferrer"
                            />,
                            <a
                                style={{ whiteSpace: "pre-wrap" }}
                                href="https://demagog.cz/"
                                target="_blank"
                                rel="noreferrer"
                            />,
                        ]}
                    />
                </p>
            </Box>
            <Box sx={paragraphStyle}>
                <p>
                    <Trans i18nKey="about:thirdParagraph" />
                </p>
            </Box>
            <Box sx={paragraphStyle}>
                <p>
                    <Trans i18nKey="about:forthParagraph" />
                </p>
            </Box>
        </Box>
    );
};

export default About;
