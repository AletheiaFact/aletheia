import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";

const FactCheckingInfo = () => {
    const { t } = useTranslation();

    return (
        <Paper
            elevation={1}
            style={{
                padding: "20px",
                margin: "16px 0",
                backgroundColor: colors.lightBlue,
                border: `1px solid ${colors.blue}`,
                borderRadius: "8px",
            }}
        >
            <Box 
                style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px" 
                }}
            >
                <InfoIcon 
                    style={{ 
                        color: colors.blue,
                        fontSize: "24px" 
                    }} 
                />
                <div>
                    <Typography 
                        variant="h6" 
                        style={{ 
                            color: colors.blue,
                            fontWeight: 600,
                            marginBottom: "4px"
                        }}
                    >
                        {t("claimReview:factCheckingInProgress")}
                    </Typography>
                    <Typography 
                        variant="body2" 
                        style={{ 
                            color: colors.blackSecondary,
                            lineHeight: 1.5 
                        }}
                    >
                        {t("claimReview:factCheckingInfoMessage")}
                    </Typography>
                </div>
            </Box>
        </Paper>
    );
};

export default FactCheckingInfo;