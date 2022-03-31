import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ClaimSourceList from "../components/Claim/ClaimSourceList";
const parser = require("accept-language-parser");

const ClaimSourcePage: NextPage<{ claimId }> = ({ claimId }) => {
    return <ClaimSourceList claimId={claimId} />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = parser.pick(locales, req.language) || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            claimId: JSON.parse(JSON.stringify(query.claimId)),
        },
    };
}
export default ClaimSourcePage;
