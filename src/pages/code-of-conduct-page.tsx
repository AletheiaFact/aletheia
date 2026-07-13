import { NextPage } from "next";
import React from "react";

import CodeOfConduct from "../components/CodeOfConduct/CodeOfConduct";
import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import { useTranslations } from "next-intl";
import { getMessages } from "../lib/getMessages";

const AboutPage: NextPage<{ data: string }> = () => {
    const tCodeOfConduct = useTranslations("codeOfConduct");
    return (
        <>
            <Seo
                title={tCodeOfConduct("title")}
                description={tCodeOfConduct(
                    "unacceptableBehaviorSectionFirstParagraph"
                )}
            />
            <CodeOfConduct />
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
