import React from "react";
import { NextPage } from "next";
import LandingPageComponent from "../components/LandingPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
const parser = require('accept-language-parser');

const LandingPage: NextPage<{ data: string }> = () => {
    return (
        <LandingPageComponent />
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

export default LandingPage;
