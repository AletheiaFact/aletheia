import React from "react";
import { Button, Divider, Box, Typography, Link } from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { StyledMenu } from "./Header.style";

const HeaderMenu = ({
    buttonLabel,
    buttonDataCy,
    sections,
    anchorEl,
    setAnchorEl,
    t,
}) => {
    return (
        <>
            <Button
                className="navLink"
                onClick={(event) => setAnchorEl(event.currentTarget)}
                endIcon={<KeyboardArrowDown fontSize="inherit" />}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl)}
                data-cy={buttonDataCy}
            >
                {buttonLabel}
            </Button>

            <StyledMenu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
            >
                {sections.flatMap((section, index) => {
                    const sectionElements = [];

                    if (index > 0) {
                        sectionElements.push(
                            <Divider key={`divider-${section.title}`} className="menu-divider" />
                        );
                    }

                    sectionElements.push(
                        <Box key={`header-${section.title}`} className="section-header">
                            {t(`header:${section.title}Section`)}
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
                                            {t(`header:${item.key}Title`)}
                                        </Typography>
                                        <Typography variant="body1" className="item-subtitle">
                                            {t(`header:${item.key}Subtitle`)}
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

export default HeaderMenu;
