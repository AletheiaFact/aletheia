import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import KanbanView from "../components/Kanban/KanbanView";
import { GetLocale } from "../utils/GetLocale";

import { useDispatch } from "react-redux";
import { ActionTypes } from "../store/types";
import AffixButton from "../components/AffixButton/AffixButton";
import actions from "../store/actions";
const KanbanPage: NextPage<{ isLoggedIn; userId; userRole; sitekey }> = (
    props
) => {
    const dispatch = useDispatch();
    dispatch(actions.setLoginStatus(props.isLoggedIn));
    dispatch(actions.setUserId(props.userId));
    dispatch(actions.setUserRole(props.userRole));
    dispatch(actions.setSitekey(props.sitekey));

    dispatch({
        type: ActionTypes.SET_AUTO_SAVE,
        autoSave: false,
    });
    return (
        <>
            <KanbanView />;
            <AffixButton />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req, query }) {
    locale = GetLocale(req, locale, locales);

    return {
        props: {
            ...(await serverSideTranslations(locale)),
            isLoggedIn: req.user ? true : false,
            userRole: req?.user?.role ? req?.user?.role : null,
            userId: req?.user?._id || "",
            sitekey: query.sitekey,
        },
    };
}

export default KanbanPage;
