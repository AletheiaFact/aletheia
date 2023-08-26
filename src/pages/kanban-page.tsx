import { ActionTypes } from "../store/types";
import AffixButton from "../components/AffixButton/AffixButton";
import { GetLocale } from "../utils/GetLocale";
import KanbanView from "../components/Kanban/KanbanView";
import { NextPage } from "next";
import React from "react";
import Seo from "../components/Seo";
import actions from "../store/actions";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";

const KanbanPage: NextPage<{ sitekey; enableCollaborativeEditor }> = (
    props
) => {
    const dispatch = useDispatch();
    dispatch(actions.setSitekey(props.sitekey));
    dispatch({
        type: ActionTypes.SET_COLLABORATIVE_EDIT,
        enableCollaborativeEdit: props.enableCollaborativeEditor,
    });

    dispatch({
        type: ActionTypes.SET_AUTO_SAVE,
        autoSave: false,
    });
    return (
        <>
            <Seo title="Kanban" />
            <KanbanView />
            <AffixButton />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req, query }) {
    locale = GetLocale(req, locale, locales);

    return {
        props: {
            ...(await serverSideTranslations(locale)),
            sitekey: query.sitekey,
            enableCollaborativeEditor: query?.enableCollaborativeEditor,
        },
    };
}

export default KanbanPage;
