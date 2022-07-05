import { NextPage } from "next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HistoryView from "../components/history/HistoryView";
const parser = require('accept-language-parser');

const HistoryPage: NextPage<{ targetId: any, targetModel: any }> = ({ targetId, targetModel }) => {
    return (
        <HistoryView targetId={targetId} targetModel={targetModel} />
    )
}

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = req.cookies.default_language || parser.pick(locales, req.language) || locale || "pt";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            targetId: JSON.parse(JSON.stringify(query.targetId)),
            targetModel: JSON.parse(JSON.stringify(query.targetModel)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}
export default HistoryPage;
