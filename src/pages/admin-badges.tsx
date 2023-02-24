import React, { useEffect } from "react";
import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";

const AdminBadgesPage: NextPage<{ data: string }> = () => {
    return (
        <>
            <p>Badges</p>
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
        },
    };
}

export default AdminBadgesPage;
