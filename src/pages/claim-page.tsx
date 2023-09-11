import { ActionTypes } from "../store/types";
import AffixButton from "../components/AffixButton/AffixButton";
import ClaimView from "../components/Claim/ClaimView";
import { GetLocale } from "../utils/GetLocale";
import JsonLd from "../components/JsonLd";
import { NextPage } from "next";
import Seo from "../components/Seo";
import actions from "../store/actions";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";

export interface ClaimPageProps {
    personality: any;
    claim: any;
    sitekey: string;
    href: string;
    enableCollaborativeEditor: boolean;
    hideDescriptions: object;
}

const ClaimPage: NextPage<ClaimPageProps> = (props) => {
    const { personality, claim, sitekey, enableCollaborativeEditor } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();

    dispatch(actions.setSitekey(sitekey));
    dispatch({
        type: ActionTypes.SET_COLLABORATIVE_EDIT,
        enableCollaborativeEdit: enableCollaborativeEditor,
    });

    const jsonld = {
        "@context": "https://schema.org",
        "@type": "Claim",
        author: personality && {
            "@type": "Person",
            name: personality.name,
            jobTitle: personality.description,
            image: personality.image,
        },
        datePublished: claim.date,
        name: claim.title,
    };

    return (
        <>
            <Seo
                title={claim.title}
                description={t("seo:claimDescription", {
                    title: claim.title,
                    name: personality?.name || "",
                })}
            />
            <JsonLd {...jsonld} />
            <ClaimView {...props} />
            <AffixButton personalitySlug={personality?.slug} />
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
            personality: query.personality
                ? JSON.parse(JSON.stringify(query.personality))
                : null,
            claim: JSON.parse(JSON.stringify(query.claim)),
            hideDescriptions: query.hideDescriptions
                ? JSON.parse(JSON.stringify(query.hideDescriptions))
                : null,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            sitekey: query.sitekey,
            enableCollaborativeEditor: query?.enableCollaborativeEditor,
        },
    };
}
export default ClaimPage;
