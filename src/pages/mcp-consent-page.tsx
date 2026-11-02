import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import McpConsent from "../components/McpConsent/McpConsent";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";

const McpConsentPage: NextPage<{ consentChallenge: string }> = ({
    consentChallenge,
}) => {
    const { t } = useTranslation();
    return (
        <>
            <Seo title="Consent" description={t("mcpConsent:scopesIntro")} />
            <McpConsent challenge={consentChallenge} />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    const { consent_challenge } = JSON.parse(query.props);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            consentChallenge: consent_challenge ?? "",
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default McpConsentPage;
