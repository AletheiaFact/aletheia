import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import AffixButton from "../components/AffixButton/AffixButton";

import ClaimCreate from "../components/Claim/ClaimCreate";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import { useDispatch } from "react-redux";
import { ActionTypes } from "../store/types";

const ClaimCreatePage: NextPage<{ sitekey; personality; isLoggedIn }> = ({
    sitekey,
    personality,
    isLoggedIn,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    dispatch({
        type: ActionTypes.SET_LOGIN_STATUS,
        login: isLoggedIn,
    });
    return (
        <>
            <Seo
                title={t("seo:claimCreateTitle")}
                description={t("seo:claimCreateDescription", {
                    name: personality.name,
                })}
            />
            <ClaimCreate sitekey={sitekey} personality={personality} />
            <AffixButton />
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
                : false,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            isLoggedIn: req.user ? true : false,
        },
    };
}
export default ClaimCreatePage;
