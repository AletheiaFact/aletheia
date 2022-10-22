import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import { GetLocale } from "../utils/GetLocale";
import ClaimCollectionView from "../components/ClaimCollection/ClaimCollectionView";
import { ActionTypes } from "../store/types";
import { Roles } from "../machine/enums";
import { useDispatch } from "react-redux";

const ClaimCollectionEditor: NextPage<any> = ({
    claimCollection,
    userId,
    isLoggedIn,
    userRole,
}): any => {
    const dispatch = useDispatch();

    dispatch({
        type: ActionTypes.SET_LOGIN_STATUS,
        login: !!isLoggedIn,
    });

    dispatch({
        type: ActionTypes.SET_USER_ROLE,
        role: userRole || Roles.Regular,
    });

    return (
        <ClaimCollectionView
            claimCollection={claimCollection}
            userId={userId}
        />
    );
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

export default ClaimCollectionEditor;
