import React from "react";
import { useHeaderData } from "./useHeaderData";
import HeaderMenu from "./HeaderMenu";
import { useTranslations } from "next-intl";

const HeaderRepositoryMenu = () => {
    const { state, actions } = useHeaderData();
    const { anchorEl, navigationConfig } = state;
    const { setAnchorEl } = actions;
    const tHeader = useTranslations("header")

    return (
        <HeaderMenu
            buttonLabel={tHeader("repositorySection")}
            buttonDataCy="testRepositoryItem"
            sections={navigationConfig.repository}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
        // t={t}
        />
    );
};

export default HeaderRepositoryMenu;
