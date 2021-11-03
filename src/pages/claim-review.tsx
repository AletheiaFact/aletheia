import {NextPage} from "next";
import ClaimReviewView from "../components/ClaimReview/ClaimReviewView";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const ClaimPage: NextPage<{ personality, claim, sentence, sitekey }> = ({ personality, claim, sentence, sitekey }) => {
    return (
        <ClaimReviewView personality={personality} claim={claim} sentence={sentence} sitekey={sitekey} />
    );
}

export async function getServerSideProps({ query, locale, req }) {
    locale = req.language || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            personality: JSON.parse(JSON.stringify(query.personality)),
            claim: JSON.parse(JSON.stringify(query.claim)),
            sentence: JSON.parse(JSON.stringify(query.sentence)),
            sitekey: query.sitekey,
            href: req.protocol + '://' + req.get('host') + req.originalUrl
        },
    };
}
export default ClaimPage;

