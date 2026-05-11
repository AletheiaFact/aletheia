import { Box, Divider, MenuItem, Typography } from "@mui/material";
import React from "react";
import colors from "../../styles/colors";
import { SidebarSection } from "../../types/header";
import { TFunction } from "next-i18next";

export interface SidebarNavLinksProps {
    sections: SidebarSection[];
    t: TFunction;
}

const SidebarNavLinks = ({ sections, t }: SidebarNavLinksProps) => {
    return (
        <Box>
            {sections.map((section, index) => (
                <Box key={section.title || index} sx={{ px: 3, py: 2 }}>
                    {section.title && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: colors.neutralTertiary,
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                display: "block",
                                paddingLeft: "6px",
                                marginBottom: "10px",
                            }}
                        >
                            {t(`header:${section.title}Section`).toUpperCase()}
                        </Typography>
                    )}

                    <Box padding="10px 0">
                        {section.items.map((item) => (
                            <MenuItem
                                key={item.key}
                                component={item.path ? "a" : "li"}
                                href={item.path}
                                onClick={item.action}
                                data-cy={item.dataCy}
                                sx={{
                                    padding: "6px",
                                    color: item.isDestructive ? colors.error : colors.white,
                                    fontSize: "14px",
                                    borderRadius: "6px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    "&:hover": {
                                        backgroundColor: `color-mix(in srgb, ${colors.lightNeutral}, transparent 90%)`,
                                        opacity: 0.8,
                                    },
                                }}
                            >
                                {item.icon && item.showIcon !== false && (
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        {item.icon}
                                    </Box>
                                )}

                                {t(`header:${item.key}Item`)}
                            </MenuItem>
                        ))}
                    </Box>

                    <Divider
                        style={{
                            backgroundColor: `color-mix(in srgb, ${colors.lightNeutral}, transparent 70%)`
                        }}
                    />
                </Box>
            ))}
        </Box>
    );
};

export default SidebarNavLinks;
