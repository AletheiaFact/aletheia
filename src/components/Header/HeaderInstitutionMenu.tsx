import React from "react";
import { useHeaderData } from "./useHeaderData";
import HeaderMenu from "./HeaderMenu";

const HeaderInstitutionMenu = () => {
    const { state, actions } = useHeaderData();
    const { anchorEl, menuInstitutionSections } = state;
    const { t, setAnchorEl } = actions;

    return (
        <HeaderMenu
            buttonLabel={t("header:institutionalItem")}
            buttonDataCy="testInstitutionalItem"
            sections={menuInstitutionSections}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            t={t}
        />
    );
};

export default HeaderInstitutionMenu;
