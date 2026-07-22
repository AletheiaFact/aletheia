import { NextPage } from "next";
import React from "react";

import PrivacyPolicy from "../components/PrivacyPolicy/PrivacyPolicy";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import { useTranslations } from "next-intl";
import { getMessages } from "../lib/getMessages";

const AboutPage: NextPage<{ data: string }> = () => {
    const tPrivacyPolicy = useTranslations("privacyPolicy");
    return (
        <>
            <Seo
                title={tPrivacyPolicy("title")}
                description={tPrivacyPolicy("item1")}
            />
            <PrivacyPolicy />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            locale,
            messages: await getMessages(locale),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default AboutPage;
