import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { MenuItem, Button, Divider, Box, Typography } from "@mui/material";

import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import { StyledMenu } from "./Header.style";

const HeaderInstitutionMenu = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [institutionAnchor, setInstitutionAnchor] = useState<null | HTMLElement>(null);

    const handleNavigate = (path: string) => {
        setInstitutionAnchor(null);
        router.push(path);
    };

    const menuSections = [
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
                onClick={(event) => setInstitutionAnchor(event.currentTarget)}
                endIcon={<KeyboardArrowDown fontSize="inherit" />}
                aria-haspopup="true"
                aria-expanded={Boolean(institutionAnchor)}
            >
                {t("menu:institutionalItem")}
            </Button>

            <StyledMenu
                anchorEl={institutionAnchor}
                open={Boolean(institutionAnchor)}
                onClose={() => setInstitutionAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                {menuSections.map((section, index) => (
                    <React.Fragment key={section.title}>
                        {index > 0 && <Divider className="menu-divider" />}

                        <Box className="section-header">{t(`menu:${section.title}Section`)}</Box>

                        {section.items.map((item) => (
                            <MenuItem key={item.path} onClick={() => handleNavigate(item.path)} className="menu-item-container">
                                <Box className="menu-item-content">
                                    <Box className="icon-wrapper">
                                        {item.icon}
                                    </Box>
                                    <Box className="text-wrapper">
                                        <Typography variant="h2" className="item-title">{t(`menu:${item.key}Title`)}</Typography>
                                        <Typography variant="body1" className="item-subtitle">{t(`menu:${item.key}Subtitle`)}</Typography>
                                    </Box>
                                </Box>
                            </MenuItem>
                        ))}
                    </React.Fragment>
                ))}
            </StyledMenu>
        </>
    );
};

export default HeaderInstitutionMenu;
