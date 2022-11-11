import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import AdminView from "../components/adminArea/AdminView";
import UserEditDrawer from "../components/adminArea/UserEditDrawer";

const Admin: NextPage = () => {
    return (
        <>
            <AdminView />
            <UserEditDrawer />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
        },
    };
}

export default Admin;
