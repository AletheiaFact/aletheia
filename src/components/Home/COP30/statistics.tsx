import React from "react";
import { useTranslation } from "next-i18next";

interface StatisticsProps {
    total: number;
    confiavel: number;
    enganoso: number;
    emAnalise: number;
}
const Statistics: React.FC<StatisticsProps> = ({
    total,
    confiavel,
    enganoso,
    emAnalise,
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
                    <span className="stat-number">{confiavel}</span>
                    <span className="stat-label">{t("cop30:statisticsReliable")}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{enganoso}</span>
                    <span className="stat-label">{t("cop30:statisticsMisleading")}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{emAnalise}</span>
                    <span className="stat-label">{t("cop30:statisticsUnderReview")}</span>
                </div>
            </div>
        </section>
    );
};

export default Statistics;
