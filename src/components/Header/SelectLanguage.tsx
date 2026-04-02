import ReactCountryFlag from "react-country-flag";
import Cookies from "js-cookie";
import React from "react";
import { Grid, MenuItem, Select, Typography } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import colors from "../../styles/colors";

interface SelectLanguage {
    defaultLanguage: string;
    dataCy: string
}

const SelectLanguage = ({ defaultLanguage, dataCy }: SelectLanguage) => {
    const language = Cookies.get("default_language") || defaultLanguage;

    const setDefaultLanguage = (newLanguage) => {
        if (!document.cookie.includes(`default_language=${newLanguage}`)) {
            window.location.reload();
        }
        document.cookie = `default_language=${newLanguage}`;
    };

    const renderValue = (value: string) => {
        const isPortuguese = value === "pt";
        return (
            <Grid item className="language-value-container">
                <LanguageIcon fontSize="inherit" />
                <Typography variant="body1" >{isPortuguese ? "BR" : "US"}</Typography>
            </Grid>
        );
    };

    return (
        <Select
            className="language-select"
            IconComponent={() => null}
            value={language}
            onChange={(e) => setDefaultLanguage(e.target.value as string)}
            onSelect={setDefaultLanguage}
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
            <MenuItem value="pt" data-cy="testLanguagePt">
                <ReactCountryFlag
                    countryCode="BR"
                    style={{ fontSize: "18px" }}
                />
                <Typography variant="body1">Português</Typography>
            </MenuItem>
            <MenuItem value="en" data-cy="testLanguageEn">
                <ReactCountryFlag
                    countryCode="GB"
                    style={{ fontSize: "18px" }}
                />
                <Typography variant="body1">English</Typography>
            </MenuItem>
        </Select >
    );
};

export default SelectLanguage;
