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
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import { NameSpaceEnum } from "../types/Namespace";

const KanbanPage: NextPage<{
    sitekey;
    enableCollaborativeEditor: boolean;
    enableAgentReview: boolean;
    enableEditorAnnotations: boolean;
    websocketUrl: string;
    nameSpace: NameSpaceEnum;
}> = (props) => {
    const dispatch = useDispatch();
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(props.nameSpace);
    dispatch(actions.setSitekey(props.sitekey));
    dispatch(actions.setWebsocketUrl(props.websocketUrl));
    dispatch({
        type: ActionTypes.SET_COLLABORATIVE_EDIT,
        enableCollaborativeEdit: props.enableCollaborativeEditor,
    });
    dispatch({
        type: ActionTypes.SET_AGENT_REVIEW,
        enableAgentReview: props.enableAgentReview,
    });
    dispatch({
        type: ActionTypes.SET_EDITOR_ANNOTATION,
        enableEditorAnnotations: props.enableEditorAnnotations,
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
            enableAgentReview: query?.enableAgentReview,
            enableEditorAnnotations: query?.enableEditorAnnotations,
            websocketUrl: query.websocketUrl,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}

export default KanbanPage;
