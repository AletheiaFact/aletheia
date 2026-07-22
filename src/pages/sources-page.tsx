import { NextPage } from "next";

import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import { NameSpaceEnum } from "../types/Namespace";
import { currentNameSpace } from "../atoms/namespace";
import { useSetAtom } from "jotai";
import SourceList from "../components/Source/SourceList";
import AffixButton from "../components/AffixButton/AffixButton";
import { useTranslations } from "next-intl";
import { getMessages } from "../lib/getMessages";

const ClaimSourcePage: NextPage<{ nameSpace }> = ({ nameSpace }) => {
    const tSeo = useTranslations("seo");
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);
    return (
        <>
            <Seo
                title={tSeo("sourcesTitle")}
                description={tSeo("sourcesDescription")}
            />
            <SourceList />
            <AffixButton />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            locale,
            messages: await getMessages(locale),
            // Nextjs have problems with client re-hydration for some serialized objects
            // This is a hack until a better solution https://github.com/vercel/next.js/issues/11993
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}
export default ClaimSourcePage;
