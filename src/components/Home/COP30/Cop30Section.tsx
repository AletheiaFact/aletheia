import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Cop30SectionStyled from "./Cop30Section.style";
import Statistics from "./statistics";
import { Grid } from "@mui/material";
import ReviewsGrid from "../../ClaimReview/ReviewsGrid";
import { Cop30Sentence } from "../../../types/Cop30Sentence";
import { Cop30Stats } from "../../../types/Cop30Stats";
import cop30Filters, { allCop30WikiDataIds } from "../../../constants/cop30Filters";
import SentenceApi from "../../../api/sentenceApi";

interface Cop30SectionProps {
    reviews: Cop30Sentence[];
}

const Cop30Section: React.FC<Cop30SectionProps> = ({ reviews }) => {
    const { t } = useTranslation();
    const [activeFilter, setActiveFilter] = useState("all");
    const [stats, setStats] = useState<Cop30Stats | null>(null);

    const [cop30Reviews, setCop30Reviews] = useState<Cop30Sentence[]>([]);

    const hasCop30Topic = (topics?: { value: string }[]) =>
        topics?.some(topic => allCop30WikiDataIds.includes(topic.value));

    const filterOptions = cop30Filters.map(filter => ({
        id: filter.id,
        wikidataId: filter.wikidataId,
        label: t(filter.translationKey),
    }));

    useEffect(() => {
        async function fetchStats() {
            const stats = await SentenceApi.getCop30Stats()
            setStats(stats);
        }
        setActiveFilter("all")
        fetchStats();
    }, []);

    useEffect(() => {
        async function fetchCop30Reviews() {
            const cop30Reviews = await SentenceApi.getSentencesWithCop30Topics();
            setCop30Reviews(cop30Reviews);
        }
        fetchCop30Reviews();
    }, [activeFilter]);

    const selectedWikiDataId = cop30Filters.find(filter => filter.id === activeFilter)?.wikidataId

    const filteredReviews =
        activeFilter === "all"
            ? cop30Reviews
            : cop30Reviews.filter(review =>
                review.content.topics?.some(
                    ({ value }) => value === selectedWikiDataId
                )
            );

    return (
        <Cop30SectionStyled>
            <Grid container xs={11} sm={11} md={9}>
                <section className="cop30-banner">
                    <div className="cop30-banner-content">
                        <div className="cop30-badge-wrapper">
                            <div className="cop30-badge">{t("cop30:cop30Conference")}</div>
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
                            reliable={stats.reliable}
                            deceptive={stats.deceptive}
                            underReview={stats.underReview}
                        />
                    )}

                    <section className="filters-container">
                        <div className="section-header">
                            <h2 className="section-title">{t("cop30:sectionLatestChecks")}</h2>
                        </div>
                        <div className="filters-grid">
                            {filterOptions.map(option => (
                                <button
                                    key={option.id}
                                    className={`filter-chip ${activeFilter === option.id ? "active" : ""}`}
                                    onClick={() => setActiveFilter(option.id)}
                                >
                                    {option.label}
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