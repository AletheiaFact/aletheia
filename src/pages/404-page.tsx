import React from "react";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Aletheia404 from "../components/Aletheia404";
const parser = require('accept-language-parser');

const Custom404Page: NextPage = () => {
    return (
        <Aletheia404 />
    )
};

export async function getServerSideProps({ locale, locales, req }) {
    locale = req.cookies.default_language || parser.pick(locales, req.language) || locale || "pt";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}


export default Custom404Page;
