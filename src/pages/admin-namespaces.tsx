import React from "react";
import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import NameSpaceView from "../components/namespace/NameSpaceView";
import { useSetAtom } from "jotai";
import { atomUserList } from "../atoms/userEdit";
import { atomNameSpacesList } from "../atoms/namespace";
import NameSpacesFormDrawer from "../components/namespace/NameSpaceFormDrawer";
import { useDispatch } from "react-redux";
import actions from "../store/actions";

const AdminNameSpacesPage: NextPage<{ data: string }> = ({
    sitekey,
    nameSpaces,
    users,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const setNameSpacesList = useSetAtom(atomNameSpacesList);
    const setUserlist = useSetAtom(atomUserList);
    setNameSpacesList(nameSpaces);
    setUserlist(users);
    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));

    return (
        <>
            <NameSpaceView />
            <NameSpacesFormDrawer />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            nameSpaces: JSON.parse(JSON.stringify(query.nameSpaces)),
            sitekey: query.sitekey,
            users: JSON.parse(JSON.stringify(query.users)),
        },
    };
}

export default AdminNameSpacesPage;
