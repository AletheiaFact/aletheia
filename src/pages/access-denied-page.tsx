import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import AcessDeniedPage from "../components/AccessDeniedPage";

interface AccessDeniedPageProps {
    originalUrl: string;
    status: string;
}

const AccessDenied: NextPage<AccessDeniedPageProps> = (props) => {
    return <AcessDeniedPage {...props} />;
};

export async function getServerSideProps({ locale, locales, req, query }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            originalUrl: JSON.parse(JSON.stringify(query?.originalUrl)),
            status: JSON.parse(JSON.stringify(query?.status)),
        },
    };
}

export default AccessDenied;
