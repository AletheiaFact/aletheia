import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import AffixButton from "../components/AffixButton/AffixButton";
import Home from "../components/Home/Home";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";

const HomePage: NextPage<{
    personalities;
    stats;
    href;
    claims;
}> = (props) => {
    const { t } = useTranslation();
    return (
        <>
            <Seo title="Home" description={t("landingPage:description")} />
            <Home {...props} />
            <AffixButton />
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
            personalities: JSON.parse(JSON.stringify(query.personalities)),
            claims: JSON.parse(JSON.stringify(query.claims)),
            stats: JSON.parse(JSON.stringify(query.stats)),
        },
    };
}
export default HomePage;
