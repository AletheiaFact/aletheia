import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import RegistrationInvite from "../components/RegistrationInvite/RegistrationInvitePage";

import { GetLocale } from "../utils/GetLocale";

const SignupInvite: NextPage<{ data: string }> = () => {

    return (
        <RegistrationInvite />
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            query,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default SignupInvite;
