import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
} from "@mui/material";
import { useAtom } from "jotai";
import { Row, Typography as AntdTypography } from "antd";
import { isUserLoggedIn } from "../atoms/currentUser";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import Image from "next/image";
import colors from "../styles/colors";

const staticLinks = [
    {
        title: "Manual de Checagem",
        description:
            "Detalhes sobre como realizar checagens dentro das diretrizes do Movimento Aletheia Fact.",
        link: "https://aletheiafact-supportive-materials.s3.amazonaws.com/Manual+de+Checagem.pdf",
        image: "/manual-thumb.png",
    },
    {
        title: "Linha do tempo da checagem de fatos",
        description:
            "Infográfico com detalhes da historia da checagem de fatos.",
        link: "https://aletheiafact-supportive-materials.s3.amazonaws.com/Poster+Timeline.pdf",
        image: "/timeline-thumb.png",
    },
    // Add more links as needed
];

const SupportiveMaterialsPage: NextPage<{ data: string }> = () => {
    const { t } = useTranslation();
    const [isLoggedIn] = useAtom(isUserLoggedIn);

    return (
        <>
            <Seo title={t("materials:title")} />
            <Row style={{ width: "100%", textAlign: "center" }}>
                <AntdTypography.Title style={{ width: "100%" }}>
                    {t("materials:title")}
                </AntdTypography.Title>
            </Row>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: "20px",
                    justifyContent: "center",
                    margin: "auto",
                    maxWidth: "1024px",
                    padding: "20px",
                }}
            >
                {!isLoggedIn ? (
                    <div style={{ marginBottom: "20px" }}>
                        <Typography variant="h6" gutterBottom>
                            {t("materials:loggedOutMessage")}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            href="/login"
                            style={{ marginRight: "10px" }}
                        >
                            {t("menu:loginItem")}
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            href="/sign-up"
                        >
                            {t("login:signup")}
                        </Button>
                    </div>
                ) : (
                    staticLinks.map(
                        ({ title, description, link, image }, index) => (
                            <Card
                                key={title}
                                sx={{
                                    width: {
                                        xs: "100%",
                                        sm: "calc(50% - 20px)",
                                        md: "calc(33.333% - 20px)",
                                        lg: "calc(25% - 20px)",
                                    },
                                    mb: 5,
                                }}
                            >
                                <div
                                    style={{
                                        position: "relative",
                                        width: "100%",
                                        height: "140px",
                                        backgroundColor: colors.bluePrimary,
                                    }}
                                >
                                    <Image
                                        src={image}
                                        alt={title}
                                        width={345} // Adjust based on your design needs
                                        height={140} // Adjust based on your design needs
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </div>
                                <CardContent>
                                    <Typography
                                        gutterBottom
                                        variant="h5"
                                        component="div"
                                    >
                                        {title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        href={link}
                                        target="_blank"
                                    >
                                        Download
                                    </Button>
                                </CardActions>
                            </Card>
                        )
                    )
                )}
            </div>
        </>
    );
};

export async function getServerSideProps({ locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default SupportiveMaterialsPage;
