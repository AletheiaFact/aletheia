import React, { useEffect } from "react";
import { InferGetServerSidePropsType, NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import AdminView from "../components/adminArea/AdminView";
import UserEditDrawer from "../components/adminArea/Drawer/UserEditDrawer";
import { useAtom, useSetAtom } from "jotai";
import { atomUserList } from "../atoms/userEdit";
import { atomBadgesList } from "../atoms/badges";
import BadgesApi from "../api/badgesApi";
import { Grid } from "@mui/material";
import DashboardView from "../components/Dashboard/DashboardView";
import AdminTabNavigator from "../components/adminArea/AdminTabNavigator";
import TabPanel from "../components/TabPanel";
import { currentNameSpace } from "../atoms/namespace";
import { NameSpaceEnum } from "../types/Namespace";

const Admin: NextPage<{ users: string; nameSpace: string }> = ({
    users,
    nameSpace,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [value, setValue] = React.useState(0);
    const [userList, setUserList] = useAtom(atomUserList);
    const [, setBadgesList] = useAtom(atomBadgesList);
    const setCurrentNameSpace = useSetAtom(currentNameSpace);
    setCurrentNameSpace(nameSpace);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (userList.length === 0) {
            setUserList(users);
        }
        BadgesApi.getBadges().then((badges) => {
            setBadgesList(badges);
        });
    }, [setBadgesList, setUserList, userList.length, users]);

    return (
        <>
            <Grid sx={{ width: "100%" }}>
                <AdminTabNavigator value={value} handleChange={handleChange} />

                <TabPanel value={value} index={0}>
                    <AdminView />
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <DashboardView />
                </TabPanel>
            </Grid>

            <UserEditDrawer />
        </>
    );
};

export async function getServerSideProps({ query, locale, locales, req }) {
    locale = GetLocale(req, locale, locales);
    return {
        props: {
            ...(await serverSideTranslations(locale)),
            users: JSON.parse(JSON.stringify(query?.users)),
            nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
        },
    };
}

export default Admin;
