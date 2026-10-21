import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import McpConsent from "../components/McpConsent/McpConsent";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";

const McpConsentPage: NextPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <Seo title="Consent" description={t("mcpConsent:scopesIntro")} />
            <McpConsent />
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

export default McpConsentPage;
