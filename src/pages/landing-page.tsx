import React from "react";
import { NextPage } from "next";
import LandingPageComponent from "../components/LandingPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextSeo } from "next-seo";
import { useTranslation } from "next-i18next";
const parser = require("accept-language-parser");

const LandingPage: NextPage<{ data: string }> = () => {
    const { t } = useTranslation();

    return (
        <>
            <NextSeo description={t("landingPage:description")} />
            <LandingPageComponent />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = parser.pick(locales, req.language) || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default LandingPage;
