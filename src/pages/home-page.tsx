import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";
import AffixButton from "../components/AffixButton/AffixButton";

import Home from "../components/Home/Home";
import Seo from "../components/Seo";
import { ActionTypes } from "../store/types";
import { GetLocale } from "../utils/GetLocale";

const HomePage: NextPage<{
    personalities;
    stats;
    href;
    isLoggedIn;
    claims;
}> = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    dispatch({
        type: ActionTypes.SET_LOGIN_STATUS,
        login: props.isLoggedIn,
    });
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
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            isLoggedIn: req.user ? true : false,
        },
    };
}
export default HomePage;
