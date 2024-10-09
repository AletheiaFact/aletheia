import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { GetLocale } from "../utils/GetLocale";
import dynamic from "next/dynamic";
import { IEditorProps } from "../components/Editor/Editor";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import { NameSpaceEnum } from "../types/Namespace";

const Editor = dynamic<IEditorProps>(
    () => import("../components/Editor/Editor"),
    {
        ssr: false,
    }
);

const DebateEditor: NextPage<{ data: string }> = ({
    claim,
    sitekey,
    nameSpace,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);
    // @ts-ignore
    return <Editor claim={claim} sitekey={sitekey} />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);

    return {
        props: {
            ...(await serverSideTranslations(locale)),
            claim: JSON.parse(JSON.stringify(query?.claim)),
            sitekey: query.sitekey,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}

export default DebateEditor;
