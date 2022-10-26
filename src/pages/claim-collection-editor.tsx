import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { GetLocale } from "../utils/GetLocale";
import dynamic from "next/dynamic";
import { IEditorProps } from "../components/Editor/Editor";

const Editor = dynamic<IEditorProps>(
    () => import("../components/Editor/Editor"),
    {
        ssr: false,
    }
);

const ClaimCollectionEditor: NextPage<{ data: string }> = ({
    claimCollection,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    // @ts-ignore
    return <Editor claimCollection={claimCollection} />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            claimCollection: JSON.parse(JSON.stringify(query?.claimCollection)),
        },
    };
}

export default ClaimCollectionEditor;
