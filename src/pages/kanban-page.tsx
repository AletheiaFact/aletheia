import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import KanbanView, { KanbanProps } from "../components/Kanban/KanbanView";
import { GetLocale } from "../utils/GetLocale";

const KanbanPage: NextPage<KanbanProps> = (props: KanbanProps) => {
    return (
        <KanbanView {...props} />
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales)

    return {
        props: {
            ...(await serverSideTranslations(locale)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            userId: req.user?._id || ''
        },
    };
}

export default KanbanPage;
