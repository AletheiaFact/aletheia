import React, { useEffect } from "react";
import { InferGetServerSidePropsType, NextPage } from "next";
import { GetLocale } from "../utils/GetLocale";
import BadgesView from "../components/badges/BadgesView";
import BadgesFormDrawer from "../components/badges/BadgesFormDrawer";
import { useSetAtom } from "jotai";
import { atomBadgesList } from "../atoms/badges";
import Seo from "../components/Seo";
import { atomUserList } from "../atoms/userEdit";
import { NameSpaceEnum } from "../types/Namespace";
import { currentNameSpace } from "../atoms/namespace";
import actions from "../store/actions";
import { useDispatch } from "react-redux";
import { useTranslations } from "next-intl";
import { getMessages } from "../lib/getMessages";

const AdminBadgesPage: NextPage<{ data: string }> = ({
    badges,
    users,
    nameSpace,
    sitekey
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const setBadgesList = useSetAtom(atomBadgesList);
    const setUserlist = useSetAtom(atomUserList);
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);
    useEffect(() => {
        setBadgesList(badges);
        setUserlist(users);
    }, [badges, setBadgesList, setUserlist, users]);
    const tHeader = useTranslations("header");
    const tBadges = useTranslations("badges");
    const dispatch = useDispatch();
    dispatch(actions.setSitekey(sitekey));

    return (
        <>
            <Seo title={tHeader("badgesItem")} description={tBadges("title")} />
            <BadgesView />
            <BadgesFormDrawer />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    query = JSON.parse(query.props);
    return {
        props: {
            locale,
            messages: await getMessages(locale),
            badges: JSON.parse(JSON.stringify(query.badges)),
            users: JSON.parse(JSON.stringify(query.users)),
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
            sitekey: query.sitekey,
        },
    };
}

export default AdminBadgesPage;
