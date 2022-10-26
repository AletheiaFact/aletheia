import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { GetLocale } from "../utils/GetLocale";
import ClaimCollectionView from "../components/ClaimCollection/ClaimCollectionView";

import { useDispatch } from "react-redux";
import actions from "../store/actions";

const ClaimCollectionViewPage: NextPage<any> = ({
    claimCollection,
    userId,
    isLoggedIn,
    userRole,
}: InferGetServerSidePropsType<typeof getServerSideProps>): any => {
    const dispatch = useDispatch();

    dispatch(actions.setLoginStatus(isLoggedIn));
    dispatch(actions.setUserId(userId));
    dispatch(actions.setUserRole(userRole));

    return <ClaimCollectionView claimCollection={claimCollection} />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            claimCollection: JSON.parse(JSON.stringify(query?.claimCollection)),
            userId: req?.user?._id || "",
            isLoggedIn: req.user ? true : false,
            userRole: req?.user?.role ? req?.user?.role : null,
        },
    };
}

export default ClaimCollectionViewPage;
