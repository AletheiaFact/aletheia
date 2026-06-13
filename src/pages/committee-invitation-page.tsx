import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";

import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import CommitteInvitationPage from "../components/CommitteInvitation/CommitteInvitationPage";

const CommitteeInvitationPage: NextPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <Seo title={t("committeeInvitation:title")} description={t("committeeInvitation:hero.description")} />
            <CommitteInvitationPage />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req }) {
    locale = GetLocale(req, locale, locales);

    return {
        props: {
            ...(await serverSideTranslations(locale)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
        },
    };
}

export default CommitteeInvitationPage;
