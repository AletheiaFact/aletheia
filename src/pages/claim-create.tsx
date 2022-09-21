import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import AffixButton from "../components/AffixButton/AffixButton";

import ClaimCreate from "../components/Claim/ClaimCreate";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import { useState } from "react";
import ClaimUploadImage from "../components/Claim/ClaimUploadImage";
import ClaimSelectType from "../components/Claim/ClaimSelectType";
import ClaimSelectPersonality from "../components/Claim/ClaimSelectPersonality";
import { useAppSelector } from "../store/store";

const ClaimCreatePage: NextPage<{ sitekey; personality; isLoggedIn }> = ({
    sitekey,
    personality,
    isLoggedIn,
}) => {
    const { t } = useTranslation();
    const [state, setState] = useState(personality ? "personality" : "type");

    const { claimPersonality } = useAppSelector((state) => ({
        claimPersonality: state.claimPersonality,
    }));
    return (
        <>
            <Seo
                title={t("seo:claimCreateTitle")}
                description={t("seo:claimCreateDescription", {
                    name: personality.name,
                })}
            />

            {state === "type" ? (
                <ClaimSelectType setState={setState} />
            ) : state === "personality" ? (
                <ClaimSelectPersonality
                    setState={setState}
                    isCreatingClaim={true}
                />
            ) : state === "image" ? (
                <ClaimUploadImage
                    personality={personality || claimPersonality}
                />
            ) : (
                <ClaimCreate
                    sitekey={sitekey}
                    personality={personality || claimPersonality}
                />
            )}
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
