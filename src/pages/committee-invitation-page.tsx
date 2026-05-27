import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { Typography } from "@mui/material";

import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";

const CommitteeInvitationPage: NextPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <Seo title={t("committeeInvitation:title")} description={t("committeeInvitation:intro")} />
            <main>
                <Typography variant="h1">{t("committeeInvitation:title")}</Typography>
                <Typography>{t("committeeInvitation:intro")}</Typography>
            </main>
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

export default CommitteeInvitationPage;
