import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { GetLocale } from "../utils/GetLocale";

import ImageClaimListView from "../components/Claim/ImageClaimListView";

const ImageClaimsPage: NextPage<any> = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    return <ImageClaimListView />;
};

export async function getServerSideProps({ locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
        },
    };
}

export default ImageClaimsPage;
