import React, { useEffect } from "react";
import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import BadgesView from "../components/badges/BadgesView";
import BadgesFormDrawer from "../components/badges/BadgesFormDrawer";
import { useAtom } from "jotai";
import { atomBadgesList } from "../atoms/badges";
import Seo from "../components/Seo";
import { useTranslation } from "next-i18next";

const AdminBadgesPage: NextPage<{ data: string }> = ({
    badges,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [, setBadgesList] = useAtom(atomBadgesList);
    useEffect(() => {
        setBadgesList(badges);
    }, [badges, setBadgesList]);
    const { t } = useTranslation();

    return (
        <>
            <Seo title={t("menu:badgesItem")} description={t("badges:title")} />
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
