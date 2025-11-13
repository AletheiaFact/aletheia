import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Cop30SectionStyled from "./Cop30Section.style";
import Statistics from "./statistics";
import { Grid } from "@mui/material";
import { buildStats } from "./utils/classification";
import { cop30Api } from "../../../api/cop30Api";
import ReviewsGrid from "../../ClaimReview/ReviewsGrid";

interface Cop30Stats {
    total: number;
    confiavel: number;
    enganoso: number;
    emAnalise: number;
}

const filterOptions = [
    "Todos",
    "Desmatamento",
    "Financiamento Climático",
    "Emissões",
    "Amazônia Azul",
    "Energia",
    "Acordos",
    "Infraestrutura",
];

const Cop30Section = ({ reviews }) => {
    const { t } = useTranslation();
    const [activeFilter, setActiveFilter] = useState("Todos");
    const [stats, setStats] = useState<Cop30Stats | null>(null);

    const cop30Reviews = reviews.filter((review) =>
        review.content.topics?.some((topic) => topic.value === "Q115323194")
    );

    useEffect(() => {
        async function statsCop30() {
            const sentences = await cop30Api.getSentences();

            const copSentencesOnly = sentences.filter(sentence =>
                sentence.topics?.some(topic => topic.value === "Q115323194")
            );

            const computedStats = buildStats(copSentencesOnly);
            setStats(computedStats);
        }
        statsCop30();
    }, []);

    const filteredReviews =
        activeFilter === "Todos"
            ? cop30Reviews
            : cop30Reviews.filter((review) =>
                review.content.topics?.some(
                    (topic) => topic.label === activeFilter
                )
            );

    return (
        <Cop30SectionStyled>
            <Grid container xs={11} sm={11} md={9}>
                <section className="cop30-banner">
                    <div className="cop30-banner-content">
                        <div className="cop30-badge-wrapper">
                            <div className="cop30-badge">{t("cop30:bannerBadge")}</div>
                            <div className="cop30-location">
                                <span>{t("cop30:bannerLocation")}</span>
                            </div>
                        </div>
                        <h1>{t("cop30:bannerTitle")}</h1>
                        <p className="bannerDescription">
                            {t("cop30:bannerDescription")}
                        </p>
                    </div>

                    {stats && (
                        <Statistics
                            total={stats.total}
                            confiavel={stats.confiavel}
                            enganoso={stats.enganoso}
                            emAnalise={stats.emAnalise}
                        />
                    )}

                    <section className="filters-container">
                        <div className="section-header">
                            <h2 className="section-title">{t("cop30:sectionLatestChecks")}</h2>
                        </div>
                        <div className="filters-grid">
                            {filterOptions.map((filter) => (
                                <button
                                    key={filter}
                                    className={`filter-chip ${activeFilter === filter ? "active" : ""}`}
                                    onClick={() => setActiveFilter(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        <ReviewsGrid reviews={filteredReviews} title="" />
                    </section>
                </section>
            </Grid>
        </Cop30SectionStyled>
    );
};

export default Cop30Section;