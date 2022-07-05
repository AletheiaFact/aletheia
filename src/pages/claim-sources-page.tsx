import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ClaimSourceList from "../components/Claim/ClaimSourceList";
import { NextSeo } from 'next-seo';
import { useTranslation } from "next-i18next";
const parser = require("accept-language-parser");

const ClaimSourcePage: NextPage<{ claimId }> = ({ claimId }) => {
    const { t } = useTranslation();

    return (
        <>
            <NextSeo 
                title={t("seo:sourcesTitle")}
                description={t("seo:sourcesDescription", {claimId})}
            />
            <ClaimSourceList claimId={claimId} />;
        </>
    )
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = req.cookies.default_language || parser.pick(locales, req.language) || locale || "pt";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            claimId: JSON.parse(JSON.stringify(query.claimId)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}
export default ClaimSourcePage;
