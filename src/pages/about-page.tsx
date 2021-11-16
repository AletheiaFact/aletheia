import React from "react";
import { NextPage } from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import About from "../components/About/About";
const parser = require('accept-language-parser');

const AboutPage: NextPage<{ data: string }> = (props) => {
    return (
        <About {...props} />
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = parser.pick(locales, req.language) || locale || "en";
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            href: req.protocol + '://' + req.get('host') + req.originalUrl
        },
    };
}

export default AboutPage;
