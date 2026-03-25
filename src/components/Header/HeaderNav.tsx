import { KeyboardArrowDown } from "@mui/icons-material";
import { Grid, Link, Menu as MuiMenu, MenuItem, Button } from "@mui/material";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { currentNameSpace } from "../../atoms/namespace";
import { currentUserId } from "../../atoms/currentUser";
import { NameSpaceEnum } from "../../types/Namespace";

import UserMenu from "./UserMenu";
import userApi from "../../api/userApi";

const HeaderNav = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [nameSpace] = useAtom(currentNameSpace);
    const [userId] = useAtom(currentUserId);
    const hasSession = !!userId;
    const [user, setUser] = useState(null);
    const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null);
    const [institutionAnchor, setInstitutionAnchor] =
        useState<null | HTMLElement>(null);

    const handleInstitutionOpen = (event: React.MouseEvent<HTMLElement>) => {
        setInstitutionAnchor(event.currentTarget);
        setAccountAnchor(null);
    };

    const handleCloseMenus = () => {
        setAccountAnchor(null);
        setInstitutionAnchor(null);
    };

    const handleNavigate = (path: string) => {
        handleCloseMenus();
        router.push(path);
    };

    useEffect(() => {
        if (hasSession) {
            userApi.getById(userId).then((user) => {
                setUser(user);
            });
        }
    }, [hasSession, userId]);

    const menuPrefix = nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "";

    return (
        <Grid item className="headerNav">
            <Link
                href={`${menuPrefix}/personality`}
                className="navLink"
                underline="none"
            >
                {t("menu:personalityItem")}
            </Link>
            <Link
                href={`${menuPrefix}/claim`}
                className="navLink"
                underline="none"
            >
                {t("menu:claimItem")}
            </Link>
            <Link
                href={`${menuPrefix}/verification-request`}
                className="navLink"
                underline="none"
            >
                {t("menu:verificationRequestItem")}
            </Link>
            <Button
                className="navLink"
                onClick={handleInstitutionOpen}
                endIcon={<KeyboardArrowDown fontSize="inherit" />}
                aria-haspopup="true"
                aria-expanded={Boolean(institutionAnchor)}
            >
                {t("menu:institutionalItem")}
            </Button>
            <UserMenu hasSession={hasSession} user={user} menuPrefix={menuPrefix} />
            <MuiMenu
                anchorEl={institutionAnchor}
                open={Boolean(institutionAnchor)}
                onClose={handleCloseMenus}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <MenuItem onClick={() => handleNavigate("/about")}>
                    {t("menu:aboutItem")}
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/privacy-policy")}>
                    {t("menu:privacyPolicyItem")}
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/code-of-conduct")}>
                    {t("menu:codeOfConductItem")}
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/supportive-materials")}>
                    {t("menu:supportiveMaterials")}
                </MenuItem>
            </MuiMenu>
        </Grid>
    );
};

export default HeaderNav;
