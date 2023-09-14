import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { ory } from "../../lib/orysdk";
import AletheiaButton from "../Button";
import { CreateLogoutHandler } from "../Login/LogoutAction";
import SelectLanguage from "./SelectLanguage";
import { useAppSelector } from "../../store/store";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import userApi from "../../api/userApi";
import { Avatar, Box } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UserMenuStyle from "./UserMenu.style";

const menuSlotProps = {
    paper: {
        elevation: 0,
        sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
            },
            "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 24,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
            },
        },
    },
};

const UserMenu = () => {
    const { vw } = useAppSelector((state) => state);
    const { t } = useTranslation();
    const router = useRouter();

    const [hasSession, setHasSession] = useState<boolean>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [user, setUser] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        ory.toSession()
            .then(async ({ data }) => {
                const user = await userApi.getByOryId(data.identity.id);
                setHasSession(true);
                setUser(user);
            })
            .catch(() => {
                setHasSession(false);
            });
    }, [hasSession]);

    const loginOrProfile = () => {
        setAnchorEl(null);
        if (router.pathname !== "/profile-page" && hasSession) {
            router.push("profile");
        } else if (router.pathname !== "/login") {
            router.push("profile");
        }
    };

    const onSignUp = () => {
        router.push("sign-up");
    };

    const onLogout = () => {
        if (!isLoading) {
            setIsLoading(true);
            CreateLogoutHandler().then(() => router.reload());
        }
        setAnchorEl(null);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AletheiaButton data-cy="testUserIcon" onClick={handleClick}>
                <AccountCircleIcon sx={{ width: 28, height: 28 }} />
            </AletheiaButton>

            <UserMenuStyle
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                slotProps={menuSlotProps}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                {hasSession && (
                    <Box className="menu-header">
                        <Avatar
                            style={{ margin: 0 }}
                            className="menu-header-avatar"
                        >
                            {user?.name.slice(0, 1)}
                        </Avatar>
                        <Box sx={{ width: "100%" }}>
                            <p className="menu-header-info name">
                                {user?.name}
                            </p>
                            <p className="menu-header-info email">
                                {user?.email}
                            </p>
                        </Box>
                    </Box>
                )}
                <MenuItem
                    key="/profile"
                    data-cy={`test${hasSession ? "MyAccount" : "Login"}Item`}
                    sx={{ fontSize: 18 }}
                    onClick={loginOrProfile}
                    disabled={isLoading}
                >
                    <ListItemIcon>
                        {hasSession ? (
                            <PersonIcon className="menu-icon" />
                        ) : (
                            <LoginIcon className="menu-icon" />
                        )}
                    </ListItemIcon>
                    {t(`menu:${hasSession ? "myAccount" : "login"}Item`)}
                </MenuItem>

                <MenuItem
                    data-cy={`test${hasSession ? "Logout" : "Register"}`}
                    key={`${hasSession ? "/home" : "/sign-up"}`}
                    disabled={isLoading}
                    sx={{ fontSize: 18 }}
                    onClick={hasSession ? onLogout : onSignUp}
                >
                    <ListItemIcon>
                        {hasSession ? (
                            <LogoutIcon className="menu-icon" />
                        ) : (
                            <PersonAddIcon className="menu-icon" />
                        )}
                    </ListItemIcon>
                    {t(`${hasSession ? "menu:logout" : "login:signup"}`)}
                </MenuItem>

                {vw?.sm && (
                    <MenuItem
                        data-cy={"testLanguages"}
                        key="/language"
                        className="select-menu-item"
                    >
                        <SelectLanguage
                            dataCy={"LanguageButton"}
                            defaultLanguage="pt"
                        />
                    </MenuItem>
                )}
            </UserMenuStyle>
        </>
    );
};

export default UserMenu;
