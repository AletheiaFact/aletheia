import {NextPage} from "next";
import ClaimView from "../components/Claim/ClaimView";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
const parser = require('accept-language-parser');

const ClaimPage: NextPage<{ personality, claim, href }> = ({ personality, claim, href }) => {
    return (
        <ClaimView personality={personality} claim={claim} href={href}/>
    );
}

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = parser.pick(locales, req.language) || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            personality: JSON.parse(JSON.stringify(query.personality)),
            claim: JSON.parse(JSON.stringify(query.claim)),
            href: req.protocol + '://' + req.get('host') + req.originalUrl
        },
    };
}
export default ClaimPage;
