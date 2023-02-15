import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import AcessDeniedPage from "../components/AcessDeniedPage";

const AcessDenied: NextPage<any> = ({ originalUrl }) => {
    return <AcessDeniedPage originalUrl={originalUrl} />;
};

export async function getServerSideProps({ locale, locales, req, query }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            originalUrl: JSON.parse(JSON.stringify(query?.originalUrl)),
        },
    };
}

export default AcessDenied;
