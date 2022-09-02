import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import KanbanView from "../components/Kanban/KanbanView";
import { GetLocale } from "../utils/GetLocale";

import { useDispatch } from "react-redux";
import { ActionTypes } from "../store/types";
import AffixButton from "../components/AffixButton/AffixButton";
const KanbanPage: NextPage<{ isLoggedIn }> = (props) => {
    const dispatch = useDispatch();
    dispatch({
        type: ActionTypes.SET_LOGIN_STATUS,
        login: props.isLoggedIn,
    });
    return (
        <>
            <KanbanView />;
            <AffixButton />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req }) {
    locale = GetLocale(req, locale, locales);

    return {
        props: {
            ...(await serverSideTranslations(locale)),
            isLoggedIn: req.user ? true : false,
        },
    };
}

export default KanbanPage;
