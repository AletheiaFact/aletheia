import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useState } from "react";

import AletheiaButton from "../Button";
import { CreateLogoutHandler } from "../Login/LogoutAction";
import SelectLanguage from "./SelectLanguage";
import { useAppSelector } from "../../store/store";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import UserMenuStyle from "./UserMenu.style";
import { currentNameSpace } from "../../atoms/namespace";
import { useAtom } from "jotai";
import { NameSpaceEnum } from "../../types/Namespace";
import UserMenuHeader from "./UserMenuHeader";

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

const UserMenu = ({ hasSession, user }) => {
    const [nameSpace] = useAtom(currentNameSpace);
    const { vw } = useAppSelector((state) => state);
    const { t } = useTranslation();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const loginOrProfile = () => {
        setAnchorEl(null);
        if (router.pathname !== "/profile-page" && hasSession) {
            router.push(
                nameSpace !== NameSpaceEnum.Main
                    ? `${nameSpace}/profile`
                    : "profile"
            );
        } else if (router.pathname !== "/login" && !hasSession) {
            router.push(
                nameSpace !== NameSpaceEnum.Main
                    ? `${nameSpace}/profile`
                    : "profile"
            );
        }
    };

    const onSignUp = () => {
        router.push("sign-up");
    };

    const onLogout = () => {
        if (!isLoading) {
            setIsLoading(true);
            CreateLogoutHandler().then(() => {
                if (nameSpace !== NameSpaceEnum.Main) {
                    router.push("/");
                } else {
                    router.reload();
                }
            });
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
            <AletheiaButton
                style={{ padding: "0 12px" }}
                data-cy="testUserIcon"
                onClick={handleClick}
            >
                <AccountCircleIcon sx={{ width: 28, height: 28 }} />
            </AletheiaButton>

            <UserMenuStyle
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                slotProps={menuSlotProps}
                namespace={nameSpace}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                {hasSession && (
                    <UserMenuHeader isLoading={isLoading} user={user} />
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

                {vw?.xs && (
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
