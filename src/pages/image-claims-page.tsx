import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { GetLocale } from "../utils/GetLocale";

import { useDispatch } from "react-redux";
import actions from "../store/actions";
import ImageClaimListView from "../components/Claim/ImageClaimListView";

const ImageClaimsPage: NextPage<any> = ({
    isLoggedIn,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const dispatch = useDispatch();
    dispatch(actions.setLoginStatus(isLoggedIn));
    return <ImageClaimListView />;
};

export async function getServerSideProps({ locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            isLoggedIn: req.user ? true : false,
        },
    };
}

export default ImageClaimsPage;
