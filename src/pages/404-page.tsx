import React from "react";
import { NextPage } from "next";
import Aletheia404 from "../components/Aletheia404";
import { GetLocale } from "../utils/GetLocale";
import { getMessages } from "../lib/getMessages";

const Custom404Page: NextPage = () => {
    return (
        <Aletheia404 />
    )
};

export async function getServerSideProps({ locale, locales, req }) {
    locale = GetLocale(req, locale, locales)
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


export default Custom404Page;
