import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";

import ReleaseNotes from "../components/ReleaseNotes/ReleaseNotes";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";

const ReleaseNotesPage: NextPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <Seo
                title={t("releaseNotes:title")}
                description={t("releaseNotes:description")}
            />
            <ReleaseNotes />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default ReleaseNotesPage;
