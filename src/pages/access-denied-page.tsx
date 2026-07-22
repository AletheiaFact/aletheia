import React from "react";
import { NextPage } from "next";
import { GetLocale } from "../utils/GetLocale";
import AcessDeniedPage from "../components/AccessDeniedPage";
import { getMessages } from "../lib/getMessages";

interface AccessDeniedPageProps {
    originalUrl: string;
    status: string;
}

const AccessDenied: NextPage<AccessDeniedPageProps> = (props) => {
    return <AcessDeniedPage {...props} />;
};

export async function getServerSideProps({ locale, locales, req, query }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            locale,
            messages: await getMessages(locale),
            originalUrl: query?.originalUrl
                ? JSON.parse(JSON.stringify(query?.originalUrl))
                : null,
            status: query?.status
                ? JSON.parse(JSON.stringify(query?.status))
                : null,
        },
    };
}

export default AccessDenied;
