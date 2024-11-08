import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HistoryView from "../components/history/HistoryView";
import { GetLocale } from "../utils/GetLocale";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";

const HistoryPage: NextPage<{
    targetId: any;
    targetModel: any;
    nameSpace: NameSpaceEnum;
}> = ({ targetId, targetModel, nameSpace }) => {
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);
    return <HistoryView targetId={targetId} targetModel={targetModel} />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            targetId: JSON.parse(JSON.stringify(query.targetId)),
            targetModel: JSON.parse(JSON.stringify(query.targetModel)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default HistoryPage;
