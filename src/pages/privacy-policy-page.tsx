import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PrivacyPolicy from "../components/PrivacyPolicy/PrivacyPolicy";
import { NextSeo } from "next-seo";
import { useTranslation } from "next-i18next";
const parser = require("accept-language-parser");

const AboutPage: NextPage<{ data: string }> = () => {
    const { t } = useTranslation();
    return (
        <>
            <NextSeo
                title={t("privacyPolicy:title")}
                description={t("privacyPolicy:item1")}
            />
            <PrivacyPolicy />
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

export default AboutPage;
