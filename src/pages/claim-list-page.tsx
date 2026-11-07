import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { GetLocale } from "../utils/GetLocale";
import Seo from "../components/Seo";
import RepositoryView from "../components/Repository/RepositoryView";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import { useTranslation } from "react-i18next";
import AffixButton from "../components/AffixButton/AffixButton";

const ImageClaimsPage: NextPage<any> = (props) => {
    const { t } = useTranslation();
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(props.nameSpace);

    return (
        <>
            <Seo
                title={t("seo:claimListTitle")}
                description={t("seo:claimListDescription")}
            />
            <RepositoryView initialQuery={props.initialQuery} />
            <AffixButton />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    const { nameSpace, ...initialQuery } = query;
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            nameSpace: nameSpace || NameSpaceEnum.Main,
            // Repository tab and filters from the URL
            initialQuery,
        },
    };
}

export default ImageClaimsPage;
