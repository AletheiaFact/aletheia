import React from "react";
import { Box, Typography, Divider, Link } from "@mui/material";
import UserMenuHeader from "./UserMenuHeader";
import colors from "../../styles/colors";
import { useHeaderData } from "./useHeaderData";
import Loading from "../Loading";

const UserMenuContent = () => {
    const { state, actions } = useHeaderData();
    const { myAccountSections, user, hasSession, isLoading } = state;
    const { t, handleClose } = actions;

    if (hasSession && !user) {
        return <Loading />;
    }

    const menuElements = [];

    if (hasSession && user) {
        menuElements.push(
            <UserMenuHeader key="user-menu-header" isLoading={isLoading} user={user} />
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
                    {t(`header:${section.title}Section`)}
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
                                {t(item.key === "signUp" ? "login:signup" : `header:${item.key}Item`)}
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
