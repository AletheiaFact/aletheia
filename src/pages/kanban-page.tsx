import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import KanbanView from "../components/Kanban/KanbanView";
import { GetLocale } from "../utils/GetLocale";

import { useDispatch } from "react-redux";
import { ActionTypes } from "../store/types";
import AffixButton from "../components/AffixButton/AffixButton";
import actions from "../store/actions";
import Seo from "../components/Seo";
const KanbanPage: NextPage<{ sitekey; enableCollaborativeEditor }> = (
    props
) => {
    const dispatch = useDispatch();
    dispatch(actions.setSitekey(props.sitekey));
    dispatch({
        type: ActionTypes.SET_COLLABORATIVE_EDIT,
        collaborativeEdit: props.enableCollaborativeEditor,
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
            enableCollaborativeEditor: JSON.parse(
                JSON.stringify(query?.enableCollaborativeEditor)
            ),
        },
    };
}

export default KanbanPage;
