import React from "react";
import { Button, Divider, Box, Typography, Link } from "@mui/material";

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import { StyledMenu } from "./Header.style";
import { useHeaderData } from "./useHeaderData";

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
        <>
            <Button
                className="navLink"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                endIcon={<KeyboardArrowDown fontSize="inherit" />}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl)}
                data-cy="testInstitutionalItem"
            >
                {t("menu:institutionalItem")}
            </Button>

            <StyledMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                {menuInstitutionSections.flatMap((section, index) => {
                    const sectionElements = [];

                    if (index > 0) {
                        sectionElements.push(
                            <Divider key={`divider-${section.title}`} className="menu-divider" />
                        );
                    }

                    sectionElements.push(
                        <Box key={`header-${section.title}`} className="section-header">
                            {t(`menu:${section.title}Section`)}
                        </Box>
                    );

                    section.items.forEach((item) => {
                        sectionElements.push(
                            <Link
                                key={item.key}
                                href={item.path}
                                className="menu-item-container"
                                underline="none"
                                data-cy={`test${item.key}`}
                            >
                                <Box className="menu-item-content">
                                    <Box className="icon-wrapper">
                                        {item.icon}
                                    </Box>
                                    <Box className="text-wrapper">
                                        <Typography variant="h2" className="item-title">
                                            {t(`menu:${item.key}Title`)}
                                        </Typography>
                                        <Typography variant="body1" className="item-subtitle">
                                            {t(`menu:${item.key}Subtitle`)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Link>
                        );
                    });

                    return sectionElements;
                })}
            </StyledMenu>
        </>
    );
};

export default HeaderInstitutionMenu;
