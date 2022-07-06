import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Aletheia404 from "../components/Aletheia404";
import { GetLocale } from "../utils/GetLocale";

const Custom404Page: NextPage = () => {
    return (
        <Aletheia404 />
    )
};

export async function getServerSideProps({ locale, locales, req }) {
    locale = GetLocale(req, locale, locales)
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}


export default Custom404Page;
