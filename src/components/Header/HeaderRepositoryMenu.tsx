import React from "react";
import { useHeaderData } from "./useHeaderData";
import HeaderMenu from "./HeaderMenu";

const HeaderRepositoryMenu = () => {
    const { state, actions } = useHeaderData();
    const { anchorEl, navigationConfig } = state;
    const { t, setAnchorEl } = actions;

    return (
        <HeaderMenu
            buttonLabel={t("header:repositorySection")}
            buttonDataCy="testRepositoryItem"
            sections={navigationConfig.repository}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            t={t}
        />
    );
};

export default HeaderRepositoryMenu;
