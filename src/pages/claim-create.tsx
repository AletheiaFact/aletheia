import { NextPage } from "next";
import ClaimCreate from "../components/Claim/ClaimCreate";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ClaimCreatePage: NextPage<{ sitekey, personality }> = ({ sitekey, personality }) => {
    return (
        <ClaimCreate sitekey={sitekey} personality={personality}/>
    )
}

export async function getServerSideProps({ query, locale, req }) {
    locale = req.language || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            sitekey: query.sitekey,
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            personality: JSON.parse(JSON.stringify(query.personality)),
        },
    };
}
export default ClaimCreatePage;
