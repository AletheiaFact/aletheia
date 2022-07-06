import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CodeOfConduct from "../components/CodeOfConduct/CodeOfConduct";
import { NextSeo } from "next-seo";
import { useTranslation } from "next-i18next";
import { GetLocale } from "../utils/GetLocale";

const AboutPage: NextPage<{ data: string }> = () => {
    const { t } = useTranslation();
    return (
        <>
            <NextSeo
                title={t("codeOfConduct:title")}
                description={t("codeOfConduct:unacceptableBehaviorSectionFirstParagraph")}
            />
            <CodeOfConduct />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales)
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            href: req.protocol + '://' + req.get('host') + req.originalUrl
        },
    };
}

export default AboutPage;
