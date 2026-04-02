import { Grid } from "@mui/material";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { currentUserId } from "../../atoms/currentUser";
import UserMenu from "./UserMenu";
import HeaderNavLinks from "./HeaderNavLinks";
import HeaderInstitutionMenu from "./HeaderInstitutionMenu";
import userApi from "../../api/userApi";

const HeaderNav = () => {
    const [userId] = useAtom(currentUserId);
    const hasSession = !!userId;
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (hasSession) {
            userApi.getById(userId).then((user) => {
                setUser(user);
            });
        }
    }, [hasSession, userId]);

    return (
        <Grid item className="headerNav">
            <HeaderNavLinks />
            <HeaderInstitutionMenu />
            <UserMenu hasSession={hasSession} user={user} />
        </Grid>
    );
};

export default HeaderNav;
