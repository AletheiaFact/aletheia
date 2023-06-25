import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";

import AffixButton from "../components/AffixButton/AffixButton";
import ClaimView from "../components/Claim/ClaimView";
import JsonLd from "../components/JsonLd";
import Seo from "../components/Seo";
import actions from "../store/actions";
import { GetLocale } from "../utils/GetLocale";

export interface ClaimPageProps {
    personality: any;
    claim: any;
    sitekey: string;
    href: string;
}

const ClaimPage: NextPage<ClaimPageProps> = (props) => {
    const { personality, claim, sitekey } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();

    dispatch(actions.setSitekey(sitekey));

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
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            sitekey: query.sitekey,
        },
    };
}
export default ClaimPage;
