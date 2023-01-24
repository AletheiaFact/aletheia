import { Provider as CreateClaimMachineProvider } from "jotai";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";

import { enableImageClaim as featureAtom } from "../atoms/featureFlags";
import AffixButton from "../components/AffixButton/AffixButton";
import CreateClaimView from "../components/Claim/CreateClaim/CreateClaimView";
import Seo from "../components/Seo";
import { claimPersonalities } from "../machines/createClaim/provider";
import actions from "../store/actions";
import { GetLocale } from "../utils/GetLocale";

const ClaimCreatePage: NextPage<any> = ({
    sitekey,
    personality,
    isLoggedIn,
    enableImageClaim,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    dispatch(actions.setLoginStatus(isLoggedIn));
    dispatch(actions.setSitekey(sitekey));
    return (
        <>
            <Seo
                title={t("seo:claimCreateTitle")}
                description={t("seo:claimCreateDescription", {
                    name: personality.name,
                })}
            />
            <CreateClaimMachineProvider
                //@ts-ignore
                initialValues={[
                    [claimPersonalities, personality ? [personality] : []],
                    [featureAtom, enableImageClaim],
                ]}
            >
                <CreateClaimView />
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
            enableImageClaim: JSON.parse(
                JSON.stringify(query?.enableImageClaim)
            ),
        },
    };
}
export default ClaimCreatePage;
