import { NextPage } from "next";
import Home from "../components/Home/Home";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Newhome: NextPage<{ data: any }> = (props) => {
    return (
        <Home {...props} />
    )
}
export async function getServerSideProps({ query, locale, req }) {
    locale = req.language || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            personalities: JSON.parse(JSON.stringify(query.personalities)),
            stats: JSON.parse(JSON.stringify(query.stats)),
            href: req.protocol + '://' + req.get('host') + req.originalUrl
        },
    };
}
export default Newhome;
