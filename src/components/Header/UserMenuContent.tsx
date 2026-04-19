import React, { useEffect, useState, ReactNode } from "react";
import { Box, Typography, Divider, Link } from "@mui/material";
import UserMenuHeader from "./UserMenuHeader";
import colors from "../../styles/colors";
import Loading from "../Loading";
import userApi from "../../api/userApi";
import { TFunction } from "i18next";

interface MenuItem {
    key: string;
    dataCy: string;
    icon: ReactNode;
    action?: () => void;
    path: string
    isDestructive?: boolean;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

interface UserMenuContentProps {
    myAccountSections: MenuSection[];
    hasSession: boolean;
    userId: string;
    isLoading: boolean;
    handleClose: () => void;
    nameSpace: string | null;
    t: TFunction;
}

const UserMenuContent = ({
    myAccountSections,
    hasSession,
    userId,
    isLoading,
    handleClose,
    nameSpace,
    t
}: UserMenuContentProps) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (hasSession) {
            userApi.getById(userId).then((user) => {
                setUser(user);
            });
        }
    }, [hasSession, userId]);

    const menuElements = [];

    if (hasSession) {
        if (!user) {
            return <Loading />;
        }

        menuElements.push(
            <UserMenuHeader
                key="user-menu-header"
                isLoading={isLoading}
                user={user}
                nameSpace={nameSpace}
                t={t}
            />
        );
    }

    myAccountSections.forEach((section, index) => {
        if (index > 0 || hasSession) {
            menuElements.push(
                <Divider key={`divider-${section.title}`} className="menu-divider" />
            );
        }

        if (section.title !== "account") {
            menuElements.push(
                <Box key={`header-${section.title}`} className="section-header">
                    {t<string>(`header:${section.title}Section`)}
                </Box>
            );
        }

        section.items.forEach((item) => {
            menuElements.push(
                <Link
                    key={item.key}
                    data-cy={item.dataCy}
                    className="menu-item-container"
                    href={item.path || undefined}
                    underline="none"
                    onClick={(event) => {
                        if (item.action) {
                            event.preventDefault();
                            item.action();
                        } else {
                            handleClose();
                        }
                    }}
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
                                {t<string>(item.key === "signUp" ? "login:signup" : `header:${item.key}Item`)}
                            </Typography>
                        </Box>
                    </Box>
                </Link>
            );
        });
    });

    return menuElements;
};

export default UserMenuContent;
