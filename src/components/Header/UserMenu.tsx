import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { MenuItem, Button, Divider, Box, Typography } from "@mui/material";

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";

import { currentNameSpace } from "../../atoms/namespace";
import { currentUserRole } from "../../atoms/currentUser";
import { NameSpaceEnum } from "../../types/Namespace";
import { isAdmin, isStaff } from "../../utils/GetUserPermission";
import { CreateLogoutHandler } from "../Login/LogoutAction";
import UserMenuHeader from "./UserMenuHeader";
import { StyledMenu } from "./Header.style";
import colors from "../../styles/colors";

const UserMenu = ({ hasSession, user }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [nameSpace] = useAtom(currentNameSpace);
    const [role] = useAtom(currentUserRole);
    const baseHref = nameSpace !== NameSpaceEnum.Main ? `/${nameSpace}` : "";

    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const loginOrProfile = () => {
        handleClose();
        if (router.pathname !== "/profile-page" && hasSession) {
            router.push(nameSpace !== NameSpaceEnum.Main ? `${nameSpace}/profile` : "profile");
        } else if (router.pathname !== "/login" && !hasSession) {
            router.push(nameSpace !== NameSpaceEnum.Main ? `${nameSpace}/profile` : "profile");
        }
    };

    const onSignUp = () => {
        handleClose();
        router.push("sign-up");
    };

    const onLogout = async () => {
        if (!isLoading) {
            setIsLoading(true);
            await CreateLogoutHandler();
            if (nameSpace !== NameSpaceEnum.Main) {
                router.push("/");
            } else {
                router.reload();
            }
        }
        handleClose();
    };

    const handleNavigate = (path: string) => {
        handleClose();
        router.push(path);
    };

    const buildMenuSections = () => {
        const sections = [];

        sections.push({
            title: "account",
            items: [
                {
                    icon: hasSession ? <PersonIcon /> : <LoginIcon />,
                    key: hasSession ? "myAccount" : "login",
                    action: loginOrProfile,
                    dataCy: `test${hasSession ? "MyAccount" : "Login"}Item`,
                },
                {
                    icon: hasSession ? <LogoutIcon /> : <PersonAddIcon />,
                    key: hasSession ? "logout" : "signUp",
                    action: hasSession ? onLogout : onSignUp,
                    dataCy: `test${hasSession ? "Logout" : "Register"}`,
                    isDestructive: hasSession,
                },
            ],
        });

        const workspaceItems = [];

        if (hasSession && isStaff(role)) {
            workspaceItems.push({
                icon: <WorkOutlineOutlinedIcon />,
                key: "kanban",
                action: () => handleNavigate(`${baseHref}/kanban`),
            });
        }

        if (hasSession && isAdmin(role)) {
            workspaceItems.push({
                icon: <ShieldOutlinedIcon />,
                key: "admin",
                action: () => handleNavigate(`${baseHref}/admin`),
            });
            workspaceItems.push({
                icon: <WorkspacePremiumOutlinedIcon />,
                key: "badges",
                action: () => handleNavigate(`${baseHref}/admin/badges`),
            });
            workspaceItems.push({
                icon: <NumbersOutlinedIcon />,
                key: "nameSpace",
                action: () => handleNavigate(`${baseHref}/admin/name-spaces`),
            });
        }

        if (workspaceItems.length > 0) {
            sections.push({
                title: "workspace",
                items: workspaceItems,
            });
        }

        return sections;
    };

    const menuSections = buildMenuSections();

    return (
        <>
            <Button
                data-cy="testUserIcon"
                className="navLink"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                endIcon={<KeyboardArrowDown fontSize="inherit" />}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl)}
            >
                {t("menu:myAccountItem")}
            </Button >

            <StyledMenu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleClose}
                namespace={nameSpace}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                {hasSession && <UserMenuHeader isLoading={isLoading} user={user} />}

                {menuSections.map((section, index) => (
                    <React.Fragment key={section.title}>
                        {(index > 0 || hasSession) && <Divider className="menu-divider" />}

                        {section.title !== "account" && (
                            <Box className="section-header">{t(`menu:${section.title}Section`)}</Box>
                        )}

                        {section.items.map((item) => (
                            <MenuItem
                                key={item.key}
                                data-cy={item.dataCy}
                                onClick={item.action}
                                disabled={isLoading}
                                className="menu-item-container"
                            >
                                <Box className="menu-item-content">
                                    <Box
                                        className="icon-wrapper"
                                        style={item.isDestructive ? { color: `${colors.error}`, backgroundColor: "transparent" } : {}}
                                    >
                                        {item.icon}
                                    </Box>
                                    <Box className="text-wrapper">
                                        <Typography
                                            variant="h2"
                                            className="item-title"
                                            style={item.isDestructive ? { color: `${colors.error}` } : {}}
                                        >
                                            {t(item.key === "signUp" ? "login:signup" : `menu:${item.key}Item`)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </MenuItem>
                        ))}
                    </React.Fragment>
                ))}
            </StyledMenu>
        </>
    );
};

export default UserMenu;
