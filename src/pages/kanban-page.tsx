import { ActionTypes } from "../store/types";
import AffixButton from "../components/AffixButton/AffixButton";
import { GetLocale } from "../utils/GetLocale";
import KanbanView from "../components/Kanban/KanbanView";
import { NextPage } from "next";
import React, { useEffect } from "react";
import Seo from "../components/Seo";
import actions from "../store/actions";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useDispatch } from "react-redux";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import { NameSpaceEnum } from "../types/Namespace";
import { Grid } from "@mui/material";
import KanbanTabNavigator from "../components/Kanban/KanbanTabNavigator";
import TabPanel from "../components/TabPanel";
import { ReviewTaskTypeEnum } from "../machines/reviewTask/enums";
import Cookies from "js-cookie";

const KanbanPage: NextPage<{
    sitekey;
    enableCollaborativeEditor: boolean;
    enableCopilotChatBot: boolean;
    enableEditorAnnotations: boolean;
    enableAddEditorSourcesWithoutSelecting: boolean;
    enableReviewersUpdateReport: boolean;
    enableViewReportPreview: boolean;
    websocketUrl: string;
    nameSpace: NameSpaceEnum;
}> = (props) => {
    const kanban_tab = Number(Cookies.get("kanban_tab")) || 0;
    const dispatch = useDispatch();
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(props.nameSpace);
    dispatch(actions.setSitekey(props.sitekey));
    dispatch(actions.setWebsocketUrl(props.websocketUrl));
    dispatch(actions.closeCopilotDrawer());
    dispatch(
        actions.setEditorEnvironment(
            props.enableCollaborativeEditor,
            props.enableAddEditorSourcesWithoutSelecting,
            props.enableEditorAnnotations,
            props.enableCopilotChatBot,
            false,
            props.enableReviewersUpdateReport,
            props.enableViewReportPreview
        )
    );

    const [value, setValue] = React.useState(null);
    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        document.cookie = `kanban_tab=${newValue}`;
        setValue(newValue);
    };

    useEffect(() => setValue(kanban_tab), [kanban_tab]);

    return (
        <>
            <Seo title="Kanban" />
            <Grid>
                <KanbanTabNavigator value={value} handleChange={handleChange} />

                {value !== null &&
                    Object.keys(ReviewTaskTypeEnum).map((key, index) => (
                        <TabPanel value={value} index={index} key={key}>
                            <KanbanView reviewTaskType={key} />
                        </TabPanel>
                    ))}
            </Grid>
            <AffixButton />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req, query }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            sitekey: query.sitekey,
            enableCollaborativeEditor: query?.enableCollaborativeEditor,
            enableCopilotChatBot: query?.enableCopilotChatBot,
            enableEditorAnnotations: query?.enableEditorAnnotations,
            enableAddEditorSourcesWithoutSelecting:
                query?.enableAddEditorSourcesWithoutSelecting,
            enableReviewersUpdateReport: query?.enableReviewersUpdateReport,
            enableViewReportPreview: query?.enableViewReportPreview,
            websocketUrl: query.websocketUrl,
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}

export default KanbanPage;
