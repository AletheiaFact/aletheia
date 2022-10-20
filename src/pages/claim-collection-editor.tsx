import { InferGetServerSidePropsType, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { GetLocale } from "../utils/GetLocale";
import dynamic from "next/dynamic";

const Editor = dynamic<React.FC>(() => import("../components/Editor/Editor"), {
    ssr: false,
});

const ClaimCollectionEditor: NextPage<{ data: string }> = ({
    enableWarningDocument,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const { t } = useTranslation();
    return <Editor />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
        },
    };
}

export default ClaimCollectionEditor;
