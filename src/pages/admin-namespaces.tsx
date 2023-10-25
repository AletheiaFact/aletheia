import React from "react";
import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import NameSpaceView from "../components/namespace/NameSpaceView";
import { useSetAtom } from "jotai";
import { atomUserList } from "../atoms/userEdit";
import { atomNameSpacesList } from "../atoms/namespace";
import NameSpacesFormDrawer from "../components/namespace/NameSpaceFormDrawer";

const AdminNameSpacesPage: NextPage<{ data: string }> = ({
    nameSpaces,
    users,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const setNameSpacesList = useSetAtom(atomNameSpacesList);
    const setUserlist = useSetAtom(atomUserList);
    setNameSpacesList(nameSpaces);
    setUserlist(users);

    // Add Seo

    return (
        <>
            <NameSpaceView />
            <NameSpacesFormDrawer />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            nameSpaces: JSON.parse(JSON.stringify(query.nameSpaces)),
            users: JSON.parse(JSON.stringify(query.users)),
        },
    };
}

export default AdminNameSpacesPage;
