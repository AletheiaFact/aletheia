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
    locale = parser.pick(locales, req.language) || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
        },
    };
}


export default Custom404Page;
