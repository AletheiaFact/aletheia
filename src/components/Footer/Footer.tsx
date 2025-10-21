/* eslint-disable @next/next/no-img-element */
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { useTranslation } from "next-i18next";
import React from "react";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import AletheiaSocialMediaFooter from "./AletheiaSocialMediaFooter";
import FooterInfo from "./FooterInfo";
import AletheiaInfo from "./AletheiaInfo";

const Footer = () => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const theme = useTheme()

    return (
        <Box
            component="footer"
            sx={{
                textAlign: "center",
                background: theme.palette.primary.main,
                color: colors.white,
                padding: "32px",
                alignSelf: "flex-end"
            }}
        >
            <Box sx={{ mt: vw?.xs ? 8 : 0 }}>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: "23px",
                        color: colors.white,
                        mb: 0,
                        textAlign: "center",
                    }}
                >
                    {t("footer:copyright", {
                        date: new Date().getFullYear(),
                    })}
                </Typography>
            </Box>
            <Box
                sx={{
                    textAlign: "center",
                    background: backgroundColor,
                    color: colors.white,
                    padding: "32px",
                    alignSelf: "flex-end"
                }}
            >
                <Grid container spacing={3} justifyContent="center">
                    <Grid item md={4} sm={6} xs={12} style={{ marginTop: "-40px" }}>
                        <AletheiaSocialMediaFooter />
                        <Box
                            sx={{
                                mt: 1,
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                
                            }}
                        >
                            <Box sx={{ mb: 2 }}>
                                <a
                                    rel="license noreferrer"
                                    href="https://creativecommons.org/licenses/by-sa/4.0/"
                                    target="_blank"
                                >
                                    <img
                                        height={31}
                                        width={88}
                                        alt="Creative Commons License"
                                        src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
                                    />
                                </a>
                            </Box>

                            {t("footer:creativeCommons")}
                            <a
                                style={{
                                    whiteSpace: "pre-wrap",
                                    display: "inline-block",
                                    color: "white",
                                }}
                                rel="license noreferrer"
                                href="https://creativecommons.org/licenses/by-sa/4.0/"
                                target="_blank"
                            >
                                Creative Commons Attribution-ShareAlike 4.0
                                International License
                            </a>
                        </Box>
                    </Grid>
                    <Grid
                        item
                        md={4}
                        sm={6}
                        xs={12}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }}
                    >
                        <FooterInfo />
                    </Grid>
                    <Grid item md={4} sm={6} xs={12}>
                        <AletheiaInfo />
                    </Grid>
                </Grid>
            </Box>
        </Box>

    );
};

export default Footer;
