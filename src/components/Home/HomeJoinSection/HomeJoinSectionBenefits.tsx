import React from "react";
import { Box, List, ListItem, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useTranslation } from "next-i18next";

const HomeJoinSectionBenefits = () => {
    const { t } = useTranslation();

    const benefits = [
        t("home:homeJoinBenefit1"),
        t("home:homeJoinBenefit2"),
        t("home:homeJoinBenefit3"),
        t("home:homeJoinBenefit4"),
    ];

    return (
        <Box className="home-join-benefits">
            <Typography
                variant="h3"
                component="h3"
                className="home-join-benefits-title"
            >
                {t("home:homeJoinBenefitsTitle")}
            </Typography>
            <List className="home-join-benefits-list">
                {benefits.map((benefit) => (
                    <ListItem
                        key={benefit}
                        disablePadding
                        className="home-join-benefit-item"
                    >
                        <CheckCircleOutlineIcon
                            className="home-join-benefit-icon"
                            aria-hidden
                        />
                        <Typography
                            variant="body1"
                            component="span"
                            className="home-join-benefit-text"
                        >
                            {benefit}
                        </Typography>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default HomeJoinSectionBenefits;