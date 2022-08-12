import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ClaimSourceList from "../components/Claim/ClaimSourceList";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";

const ClaimSourcePage: NextPage<{ targetId }> = ({ targetId }) => {
    const { t } = useTranslation();
    return (
        <>
            <Seo
                title={t("seo:sourcesTitle")}
                description={t("seo:sourcesDescription", { claimId: targetId })}
            />
            <ClaimSourceList claimId={targetId} />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            targetId: JSON.parse(JSON.stringify(query.targetId)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}
export default ClaimSourcePage;
