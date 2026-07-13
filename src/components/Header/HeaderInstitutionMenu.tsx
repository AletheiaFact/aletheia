import React from "react";
import { useHeaderData } from "./useHeaderData";
import HeaderMenu from "./HeaderMenu";
import { useTranslations } from "next-intl";

const HeaderInstitutionMenu = () => {
    const { state, actions } = useHeaderData();
    const { anchorEl, menuInstitutionSections } = state;
    const { setAnchorEl } = actions;
    const tHeader = useTranslations("header");

    return (
        <HeaderMenu
            buttonLabel={tHeader("institutionalItem")}
            buttonDataCy="testInstitutionalItem"
            sections={menuInstitutionSections}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
        // t={t}
        />
    );
};

export default HeaderInstitutionMenu;
