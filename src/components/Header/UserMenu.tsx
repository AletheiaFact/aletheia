import React from "react";
import { Button } from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { StyledMenu } from "./Header.style";
import UserMenuContent from "./UserMenuContent";
import { useHeaderData } from "./useHeaderData";

const UserMenu = () => {
    const { state, actions } = useHeaderData();
    const {
        nameSpace,
        anchorEl,
        myAccountSections,
        hasSession,
        userId,
        isLoading
    } = state;
    const { t, setAnchorEl, handleClose } = actions;

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
                {t("header:myAccountItem")}
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
                    userId={userId}
                    isLoading={isLoading}
                    handleClose={handleClose}
                    nameSpace={nameSpace}
                    t={t}
                />
            </StyledMenu>
        </>
    );
};

export default UserMenu;
