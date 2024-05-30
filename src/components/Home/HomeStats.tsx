import React from "react";
import { useTranslation } from "next-i18next";
import colors from "../../styles/colors";
import { Stats } from "./Stats";
import { Col } from "antd";

const HomeStats = ({ stats }) => {
    const { t } = useTranslation();

    return (
        <Col
            xxl={12}
            lg={16}
            sm={18}
            xs={24}
            style={{
                color: colors.white,
                width: "100%",
                justifyContent: "space-between",
                display: "flex",
                gap: "2vw",
            }}
        >
            <Stats
                info={stats.personalities}
                title={t("home:statsPersonalities")}
                style={{ justifyContent: "flex-start" }}
            />
            <Stats info={stats.claims} title={t("home:statsClaims")} />
            <Stats
                info={stats.reviews}
                title={t("home:statsClaimReviews")}
                style={{ justifyContent: "flex-end" }}
            />
        </Col>
    );
};

export default HomeStats;
