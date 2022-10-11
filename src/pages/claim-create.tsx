import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import AffixButton from "../components/AffixButton/AffixButton";
import CreateClaimView from "../components/Claim/CreateClaim/CreateClaimView";
import Seo from "../components/Seo";
import { CreateClaimMachineProvider } from "../Context/CreateClaimMachineProvider";
import { GetLocale } from "../utils/GetLocale";

const ClaimCreatePage: NextPage<{ sitekey; personality; isLoggedIn }> = ({
    sitekey,
    personality,
    isLoggedIn,
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
            <CreateClaimMachineProvider
                context={{ claimData: { personality: personality } }}
            >
                <CreateClaimView sitekey={sitekey} />
                <AffixButton />
            </CreateClaimMachineProvider>
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
            personality: query?.personality
                ? JSON.parse(JSON.stringify(query?.personality))
                : "",
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            isLoggedIn: req.user ? true : false,
        },
    };
}
export default ClaimCreatePage;
