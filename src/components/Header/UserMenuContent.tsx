import React from "react";
import { Box, Typography, Divider, Link } from "@mui/material";
import UserMenuHeader from "./UserMenuHeader";
import colors from "../../styles/colors";
import { SidebarSection } from "../../types/header";
import { TFunction } from "next-i18next";
import { User } from "../../types/User";

export interface UserMenuContentProps {
    myAccountSections: SidebarSection[];
    hasSession: boolean;
    user: User | null;
    isLoadingUser: boolean;
    nameSpace: string | null;
    t: TFunction;
}

const UserMenuContent = ({
    myAccountSections,
    hasSession,
    user,
    isLoadingUser,
    nameSpace,
    t
}: UserMenuContentProps) => {
    const menuElements = [];

    menuElements.push(
        <UserMenuHeader
            key="user-menu-header"
            isLoadingUser={isLoadingUser}
            user={user}
            hasSession={hasSession}
            nameSpace={nameSpace}
            t={t}
        />
    );

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
