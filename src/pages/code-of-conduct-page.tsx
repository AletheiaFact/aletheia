import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";

import CodeOfConduct from "../components/CodeOfConduct/CodeOfConduct";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";

const AboutPage: NextPage<{ data: string }> = () => {
    const { t } = useTranslation();
    return (
        <>
            <Seo
                title={t("codeOfConduct:title")}
                description={t(
                    "codeOfConduct:unacceptableBehaviorSectionFirstParagraph"
                )}
            />
            <CodeOfConduct />
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
