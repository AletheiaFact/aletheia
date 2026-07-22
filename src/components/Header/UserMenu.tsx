import React from "react";
import { Button } from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { StyledMenu } from "./Header.style";
import UserMenuContent from "./UserMenuContent";
import { useHeaderData } from "./useHeaderData";
import { useTranslations } from "next-intl";

const UserMenu = () => {
    const { state, actions } = useHeaderData();
    const {
        nameSpace,
        anchorEl,
        myAccountSections,
        hasSession,
        user,
        isLoadingUser
    } = state;
    const { setAnchorEl, handleClose } = actions;
    const tHeader = useTranslations("header");

    return (
        <>
            <Button
                data-cy="testMyAccountItem"
                className="navLink"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                endIcon={<KeyboardArrowDown fontSize="inherit" />}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl)}
            >
                {tHeader("myAccountItem")}
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
                <UserMenuContent
                    myAccountSections={myAccountSections}
                    hasSession={hasSession}
                    user={user}
                    isLoadingUser={isLoadingUser}
                    nameSpace={nameSpace}
                />
            </StyledMenu>
        </>
    );
};

export default UserMenu;
