import React, { ReactNode } from "react";
import { Grid, MenuItem, Select, Typography } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import colors from "../../styles/colors";

interface LanguageOption {
    value: string;
    label: string;
    displayAbbreviation: string;
    icon: ReactNode;
    key: string;
    action: () => void;
    dataCy: string;
}

interface LanguageSection {
    title: string;
    items: LanguageOption[];
}

interface SelectLanguageProps {
    dataCy: string;
    currentLanguage: string;
    sections: LanguageSection[];
    onChange: (newLanguage: string) => void;
}

const SelectLanguage = ({ dataCy, currentLanguage, sections, onChange }: SelectLanguageProps) => {
    const languageItems = sections[0]?.items || [];

    const renderValue = (value: string) => {
        const selectedItem = languageItems.find(item => item.value === value);
        return (
            <Grid item className="language-value-container">
                <LanguageIcon fontSize="inherit" />
                <Typography variant="body1">
                    {selectedItem?.displayAbbreviation || "BR"}
                </Typography>
            </Grid>
        );
    };

    return (
        <Select
            className="language-select"
            IconComponent={() => null}
            value={currentLanguage}
            onChange={(e) => onChange(e.target.value as string)}
            data-cy={dataCy}
            renderValue={renderValue}
            MenuProps={{
                slotProps: {
                    paper: {
                        sx: {
                            backgroundColor: `${colors.white}`,

                            "& .MuiMenu-list": {
                                padding: "8px",
                            },

                            "& .MuiMenuItem-root": {
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                color: `${colors.blackSecondary}`,

                                "&:hover": {
                                    backgroundColor: `${colors.lightNeutralSecondary}`,
                                }
                            }
                        }
                    }
                }
            }}
        >
            {languageItems.map((item) => (
                <MenuItem key={item.key} value={item.value} data-cy={item.dataCy}>
                    {item.icon}
                    <Typography variant="body1">{item.label}</Typography>
                </MenuItem>
            ))}
        </Select>
    );
};

export default SelectLanguage;
