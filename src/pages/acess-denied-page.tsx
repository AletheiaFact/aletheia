import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import AcessDeniedPage from "../components/AcessDeniedPage";
import { useDispatch } from "react-redux";
import actions from "../store/actions";

const AcessDenied: NextPage<any> = ({ userRole, originalUrl }) => {
    const dispatch = useDispatch();
    dispatch(actions.setUserRole(userRole));

    return <AcessDeniedPage originalUrl={originalUrl} />;
};

export async function getServerSideProps({ locale, locales, req, query }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            userRole: req?.user?.role ? req?.user?.role : null,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            originalUrl: JSON.parse(JSON.stringify(query?.originalUrl)),
        },
    };
}

export default AcessDenied;
