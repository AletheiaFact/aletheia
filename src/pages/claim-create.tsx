import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import AffixButton from "../components/AffixButton/AffixButton";

import ClaimCreate from "../components/Claim/ClaimCreate";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import { useDispatch } from "react-redux";
import { ActionTypes } from "../store/types";
import { useState } from "react";
import ClaimUploadImage from "../components/Claim/ClaimUploadImage";
import ClaimSelectType from "../components/Claim/ClaimSelectType";
import ClaimSelectPersonality from "../components/Claim/ClaimSelectPersonality";

const ClaimCreatePage: NextPage<{ sitekey; personality; isLoggedIn }> = ({
    sitekey,
    personality,
    isLoggedIn,
}) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [state, setState] = useState(personality ? "personality" : "type");
    const [type, setType] = useState("");
    const [personalityClaim, setPersonalityClaim] = useState();

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

            {state === "type" ? (
                <ClaimSelectType setState={setState} setType={setType} />
            ) : state === "personality" ? (
                <ClaimSelectPersonality
                    setState={setState}
                    setPersonalityClaim={setPersonalityClaim}
                    isCreatingClaim={true}
                />
            ) : state === "image" ? (
                <ClaimUploadImage
                    personality={personality || personalityClaim}
                />
            ) : (
                <ClaimCreate
                    sitekey={sitekey}
                    personality={personality || personalityClaim}
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
