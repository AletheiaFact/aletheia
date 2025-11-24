import React from "react";
import { useTranslation } from "next-i18next";

interface StatisticsProps {
    total: number;
    reliable: number;
    deceptive: number;
    underReview: number;
}
const Statistics: React.FC<StatisticsProps> = ({
    total,
    reliable,
    deceptive,
    underReview,
}) => {
    const { t } = useTranslation();

    return (
        <section className="stats-container">
            <div className="stats-grid">
                <div className="stat-item">
                    <span className="stat-number">{total}</span>
                    <span className="stat-label">{t("cop30:statisticsTotalChecks")}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{reliable}</span>
                    <span className="stat-label">{t("cop30:statisticsReliable")}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{deceptive}</span>
                    <span className="stat-label">{t("cop30:statisticsMisleading")}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{underReview}</span>
                    <span className="stat-label">{t("cop30:statisticsUnderReview")}</span>
                </div>
            </div>
        </section>
    );
};

export default Statistics;
