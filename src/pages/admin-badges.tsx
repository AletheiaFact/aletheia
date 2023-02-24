import React, { useEffect } from "react";
import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import BadgesView from "../components/badges/BadgesView";
import BadgesFormDrawer from "../components/badges/BadgesFormDrawer";
import { useAtom } from "jotai";
import { badgesList } from "../atoms/badgesForm";

const AdminBadgesPage: NextPage<{ data: string }> = ({
    badges,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [, setBadgesList] = useAtom(badgesList);
    useEffect(() => {
        setBadgesList(badges);
    }, [badges, setBadgesList]);

    return (
        <>
            <BadgesView />
            <BadgesFormDrawer />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            badges: JSON.parse(JSON.stringify(query.badges)),
        },
    };
}

export default AdminBadgesPage;
