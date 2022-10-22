import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { GetLocale } from "../utils/GetLocale";
import ClaimCollectionView from "../components/ClaimCollection/ClaimCollectionView";

const ClaimCollectionEditor: NextPage<any> = ({ claimCollection }): any => {
    // console.log(claimCollection?.editorContentObject?.content)
    return (
        <ClaimCollectionView
            claimCollectionId={claimCollection._id}
            collections={claimCollection?.editorContentObject?.content}
        />
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    console.log(query?.claimCollection);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            claimCollection: JSON.parse(JSON.stringify(query?.claimCollection)),
        },
    };
}

export default ClaimCollectionEditor;
