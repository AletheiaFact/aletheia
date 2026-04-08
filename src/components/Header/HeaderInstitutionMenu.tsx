import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import { useHeaderData } from "./useHeaderData";
import HeaderMenu from "./HeaderMenu";

const HeaderInstitutionMenu = () => {
    const { state, actions } = useHeaderData();
    const { anchorEl } = state;
    const { t, setAnchorEl } = actions;

    const menuInstitutionSections = [
        {
            title: "platform",
            items: [
                {
                    icon: <InfoOutlinedIcon />,
                    key: "aboutItem",
                    path: "/about",
                },
                {
                    icon: <MenuBookOutlinedIcon />,
                    key: "supportiveMaterialsItem",
                    path: "/supportive-materials",
                },
            ],
        },
        {
            title: "legal",
            items: [
                {
                    icon: <DescriptionOutlinedIcon />,
                    key: "privacyPolicyItem",
                    path: "/privacy-policy",
                },
                {
                    icon: <BalanceOutlinedIcon />,
                    key: "codeOfConductItem",
                    path: "/code-of-conduct",
                },
            ],
        },
    ];

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
