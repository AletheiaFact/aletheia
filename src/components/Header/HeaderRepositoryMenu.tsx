import React from "react";
import PortraitOutlinedIcon from "@mui/icons-material/PortraitOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import { useHeaderData } from "./useHeaderData";
import HeaderMenu from "./HeaderMenu";

const HeaderRepositoryMenu = () => {
    const { state, actions } = useHeaderData();
    const { anchorEl, baseHref } = state;
    const { t, setAnchorEl } = actions;

    const menuRepositorySections = [
        {
            title: "repository",
            items: [
                {
                    icon: <PortraitOutlinedIcon />,
                    key: "personalityItem",
                    path: `${baseHref}/personality`,
                },
                {
                    icon: <FactCheckOutlinedIcon />,
                    key: "claimItem",
                    path: `${baseHref}/claim`,
                },
            ],
        },
    ];

    return (
        <HeaderMenu
            buttonLabel={t("header:repositorySection")}
            buttonDataCy="testRepositoryItem"
            sections={menuRepositorySections}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            t={t}
        />
    );
};

export default HeaderRepositoryMenu;
