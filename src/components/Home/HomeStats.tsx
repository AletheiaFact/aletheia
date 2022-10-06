import { useTranslation } from "next-i18next";
import React from "react";

import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import { Stats } from "./Stats";

const HomeStats = ({ stats }) => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const statsHeight = vw?.sm ? 66 : 86;

    return (
        <div
            style={{
                backgroundColor: colors.bluePrimary,
                color: colors.white,
                width: vw?.sm ? "100%" : "88%",
                justifyContent: "space-between",
                padding: "0 18px",
                marginLeft: "auto",
                position: "relative",
                height: statsHeight,
                top: statsHeight / -2,
                display: "flex",
                gap: "2vw",
            }}
        >
            <Stats
                info={stats.personalities}
                title={t("home:statsPersonalities")}
            />
            <Stats info={stats.claims} title={t("home:statsClaims")} />
            <Stats info={stats.reviews} title={t("home:statsClaimReviews")} />
        </div>
    );
};

export default HomeStats;
