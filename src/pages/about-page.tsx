import { NextPage } from "next";
import React from "react";

import About from "../components/About/About";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import { useTranslations } from "next-intl";
import { getMessages } from "../lib/getMessages";

const AboutPage: NextPage<{ data: string }> = () => {
    const tAbout = useTranslations("about");
    return (
        <>
            <Seo title={tAbout("title")} description={tAbout("intro")} />
            <About />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            locale,
            messages: await getMessages(locale),
            href:
                req.protocol +
                "://" +
                req.get("host") +
                req.originalUrl,
        },
    };
}

export default AboutPage;
