import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { useDispatch } from "react-redux";

import Seo from "../components/Seo";
import { GetLocale } from "../utils/GetLocale";
import CommitteInvitationPage from "../components/CommitteInvitation/CommitteInvitationPage";
import actions from "../store/actions";
import { CaptchaClientConfig } from "../types/Captcha";

const CommitteeInvitationPage: NextPage<{
    sitekey: string;
    captcha: CaptchaClientConfig;
}> = ({ sitekey, captcha }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));
    dispatch(actions.setCaptchaConfig(captcha));

    return (
        <>
            <Seo
                title={t("committeeInvitation:title")}
                description={t("committeeInvitation:hero.description")}
            />
            <CommitteInvitationPage />
        </>
    );
};

export async function getServerSideProps({ locale, locales, req, query }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);

    return {
        props: {
            ...(await serverSideTranslations(locale)),
            href: req.protocol + "://" + req.get("host") + req.originalUrl,
            sitekey: query.sitekey,
            captcha: query.captcha,
        },
    };
}

export default CommitteeInvitationPage;
