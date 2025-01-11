import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { GetLocale } from "../utils/GetLocale";
import DebateView from "../components/Debate/DebateView";

import { useDispatch } from "react-redux";
import actions from "../store/actions";
import AffixButton from "../components/AffixButton/AffixButton";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";

const DebatePage: NextPage<any> = ({
    claim,
    sitekey,
    nameSpace,
    enableCollaborativeEditor,
    enableCopilotChatBot,
    enableEditorAnnotations,
    enableAddEditorSourcesWithoutSelecting,
    enableReviewersUpdateReport,
    enableViewReportPreview,
}: InferGetServerSidePropsType<typeof getServerSideProps>): any => {
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);
    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));
    dispatch(
        actions.setEditorEnvironment(
            enableCollaborativeEditor,
            enableAddEditorSourcesWithoutSelecting,
            enableEditorAnnotations,
            enableCopilotChatBot,
            false,
            enableReviewersUpdateReport,
            enableViewReportPreview
        )
    );

    return (
        <>
            <AffixButton />
            <DebateView claim={claim} />;
        </>
    );
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
            enableCollaborativeEditor: query?.enableCollaborativeEditor,
            enableCopilotChatBot: query?.enableCopilotChatBot,
            enableEditorAnnotations: query?.enableEditorAnnotations,
            enableAddEditorSourcesWithoutSelecting:
                query?.enableAddEditorSourcesWithoutSelecting,
            enableViewReportPreview: query?.enableViewReportPreview,
            enableReviewersUpdateReport: query?.enableReviewersUpdateReport,
        },
    };
}

export default DebatePage;
