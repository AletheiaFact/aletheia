import { InferGetServerSidePropsType, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";

import About from "../components/About/About";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";

const AboutPage: NextPage<{ data: string }> = ({
    enableWarningDocument,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { t } = useTranslation();
    return (
        <>
            <Seo title={t("about:title")} description={t("about:intro")} />
            <About enableWarningDocument={enableWarningDocument} />
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
            enableWarningDocument: query.enableWarningDocument,
        },
    };
}

export default AboutPage;
