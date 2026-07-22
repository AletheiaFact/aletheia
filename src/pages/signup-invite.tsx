import { NextPage } from "next";
import React from "react";
import RegistrationInvite from "../components/RegistrationInvite/RegistrationInvitePage";

import { GetLocale } from "../utils/GetLocale";
import { getMessages } from "../lib/getMessages";

const SignupInvite: NextPage<{ data: string }> = () => {

    return (
        <RegistrationInvite />
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            locale,
            messages: await getMessages(locale),
            query,
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default SignupInvite;
