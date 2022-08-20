import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import ClaimCreate from "../components/Claim/ClaimCreate";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";

const ClaimCreatePage: NextPage<{ sitekey; personality }> = ({
    sitekey,
    personality,
}) => {
    const { t } = useTranslation();

    return (
        <>
            <Seo
                title={t("seo:claimCreateTitle")}
                description={t("seo:claimCreateDescription", {
                    name: personality.name,
                })}
            />

            <ClaimCreate sitekey={sitekey} personality={personality} />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            sitekey: query.sitekey,
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            personality: JSON.parse(JSON.stringify(query.personality)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}
export default ClaimCreatePage;
