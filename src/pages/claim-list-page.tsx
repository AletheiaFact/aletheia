import { NextPage } from "next";
import React from "react";
import { GetLocale } from "../utils/GetLocale";
import Seo from "../components/Seo";
import ClaimListView from "../components/Claim/ClaimListView";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import AffixButton from "../components/AffixButton/AffixButton";
import { useTranslations } from "next-intl";
import { getMessages } from "../lib/getMessages";

const ImageClaimsPage: NextPage<any> = (props) => {
    const tSeo = useTranslations("seo");
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(props.nameSpace);

    return (
        <>
            <Seo
                title={tSeo("claimListTitle")}
                description={tSeo("claimListDescription")}
            />
            <ClaimListView />
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
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}

export default ImageClaimsPage;
