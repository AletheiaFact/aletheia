import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";

import PrivacyPolicy from "../components/PrivacyPolicy/PrivacyPolicy";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";

const AboutPage: NextPage<{ data: string }> = () => {
    const { t } = useTranslation();
    return (
        <>
            <Seo
                title={t("privacyPolicy:title")}
                description={t("privacyPolicy:item1")}
            />
            <PrivacyPolicy />
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

export default AboutPage;
