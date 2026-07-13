import { NextPage } from "next";
import React from "react";

import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import CommitteInvitationPage from "../components/CommitteInvitation/CommitteInvitationPage";
import { useTranslations } from "next-intl";
import { getMessages } from "../lib/getMessages";

const CommitteeInvitationPage: NextPage = () => {
    const tCommitteeInvitation = useTranslations("committeeInvitation");
    return (
        <>
            <Seo title={tCommitteeInvitation("title")} description={tCommitteeInvitation("hero.description")} />
            <CommitteInvitationPage />
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

export default CommitteeInvitationPage;
