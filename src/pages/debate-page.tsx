import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { GetLocale } from "../utils/GetLocale";
import DebateView from "../components/Debate/DebateView";

import { useDispatch } from "react-redux";
import actions from "../store/actions";

const DebatePage: NextPage<any> = ({
    claim,
    sitekey,
}: InferGetServerSidePropsType<typeof getServerSideProps>): any => {
    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));

    return <DebateView claim={claim} />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            claim: JSON.parse(JSON.stringify(query?.claim)),
            sitekey: query.sitekey,
        },
    };
}

export default DebatePage;
