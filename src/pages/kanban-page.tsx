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
    enableCopilotChatBot: boolean;
    enableEditorAnnotations: boolean;
    enableAddEditorSourcesWithoutSelecting: boolean;
    websocketUrl: string;
    nameSpace: NameSpaceEnum;
}> = (props) => {
    const dispatch = useDispatch();
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(props.nameSpace);
    dispatch(actions.setSitekey(props.sitekey));
    dispatch(actions.setWebsocketUrl(props.websocketUrl));
    dispatch(actions.closeCopilotDrawer());
    dispatch({
        type: ActionTypes.SET_COLLABORATIVE_EDIT,
        enableCollaborativeEdit: props.enableCollaborativeEditor,
    });
    dispatch({
        type: ActionTypes.SET_COPILOT_CHAT_BOT,
        enableCopilotChatBot: props.enableCopilotChatBot,
    });
    dispatch({
        type: ActionTypes.SET_EDITOR_ANNOTATION,
        enableEditorAnnotations: props.enableEditorAnnotations,
    });
    dispatch({
        type: ActionTypes.SET_ADD_EDITOR_SOURCES_WITHOUT_SELECTING,
        enableAddEditorSourcesWithoutSelecting:
            props.enableAddEditorSourcesWithoutSelecting,
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
            enableCopilotChatBot: query?.enableCopilotChatBot,
            enableEditorAnnotations: query?.enableEditorAnnotations,
            enableAddEditorSourcesWithoutSelecting:
                query?.enableAddEditorSourcesWithoutSelecting,
            websocketUrl: query.websocketUrl,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}

export default KanbanPage;
