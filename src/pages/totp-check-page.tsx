import React from "react";
import { NextPage } from "next";
import { GetLocale } from "../utils/GetLocale";
import AalCheckPage from "../components/TotpCheckPage";
import { getMessages } from "../lib/getMessages";

const TotpCheckPage: NextPage = () => {
    return <AalCheckPage />;
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

export default TotpCheckPage;
