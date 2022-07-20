import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import KanbanView from "../components/Kanban/KanbanView";
import { GetLocale } from "../utils/GetLocale";

const KanbanPage: NextPage = () => {
    return <KanbanView />;
};

export async function getServerSideProps({ locale, locales, req }) {
    locale = GetLocale(req, locale, locales);

    return {
        props: {
            ...(await serverSideTranslations(locale)),
        },
    };
}

export default KanbanPage;
