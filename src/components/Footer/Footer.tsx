/* eslint-disable @next/next/no-img-element */
import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { useLayoutEffect, useState } from "react";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import AletheiaSocialMediaFooter from "./AletheiaSocialMediaFooter";
import FooterInfo from "./FooterInfo";
import AletheiaInfo from "./AletheiaInfo";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const Footer = () => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const [nameSpace] = useAtom(currentNameSpace);
    const [backgroundColor, setBackgroundColor] = useState(colors.primary);

    useLayoutEffect(() => {
        setBackgroundColor(
            nameSpace === NameSpaceEnum.Main ? colors.primary : colors.secondary
        );
    }, [nameSpace]);

    return (
        <Box
            component="footer"
            sx={{
                textAlign: "center",
                background: backgroundColor,
                color: colors.white,
                padding: "32px",
                alignSelf: "flex-end"
            }}
        >
            <Grid container spacing={3} justifyContent="center">
                <Grid item md={4} sm={6} xs={12}>
                    <AletheiaSocialMediaFooter />
                    <Box
                        sx={{
                            mt: 1,
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            mb: vw?.sm ? 4 : 0,
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
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                    <AletheiaInfo />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Footer;
