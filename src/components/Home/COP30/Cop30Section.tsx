import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Cop30SectionStyled from "./Cop30Section.style";
import Statistics from "./statistics";
import Claim from "./Claims";
import { Grid } from "@mui/material";

interface Cop30Review {
    _id: string;
    date: string;
    status: "confiavel" | "enganoso";
    authorName: string;
    authorRole: string;
    authorAvatar?: string;
    claimText: string;
    topics: string[];
    claimId?: string;
    personalityId?: string;
}

interface Cop30Stats {
    total: number;
    confiavel: number;
    enganoso: number;
    emAnalise: number;
}

interface Cop30SectionProps {
    reviews?: Cop30Review[];
    stats?: Cop30Stats;
}

const defaultStats: Cop30Stats = {
    total: 47,
    confiavel: 28,
    enganoso: 15,
    emAnalise: 4,
};

const defaultReviews: Cop30Review[] = [
    {
        _id: "1",
        date: "28/10/2025",
        status: "confiavel",
        authorName: "Henderson Lira Pinto",
        authorRole: "Político do Brasil",
        claimText: "66% do território nacional ainda é coberto por essa vegetação, sendo 33% dentro das propriedades rurais.",
        topics: ["Desmatamento", "Dados Ambientais"],
    },
    {
        _id: "2",
        date: "14/10/2025",
        status: "confiavel",
        authorName: "Gustavo Souza",
        authorRole: "Diretor sênior de Políticas Públicas e Incentivos da Conservação Internacional",
        claimText: "As soluções baseadas na natureza podem gerar até 30% das reduções de emissões necessárias até 2030, mas recebem menos de 3% do financiamento climático.",
        topics: ["Financiamento Climático", "Soluções Baseadas na Natureza"],
    },
    {
        _id: "3",
        date: "23/07/2025",
        status: "enganoso",
        authorName: "Cristina Graeml",
        authorRole: "Jornalista e política brasileira",
        claimText: "O Ministério da Cidade está disponibilizando 40 milhões de reais para que sejam entregues pelo menos 256 moradias de um total de 768 unidades, então seriam mais 256 possibilidades de hospedagem no Minha Casa, Minha Vida, porque não há leitos para hospedar os convidados para COP 30.",
        topics: ["Infraestrutura", "Políticas Públicas"],
    },
    {
        _id: "4",
        date: "21/10/2025",
        status: "enganoso",
        authorName: "Gleisi Hoffmann",
        authorRole: "Política brasileira, ministra-chefe da Secretaria de Relações Institucionais da Presidência da República",
        claimText: "A licença do Ibama para a pesquisa de petróleo na Margem Equatorial é o resultado de quase cinco anos de estudos, audiências públicas e medidas de proteção ambiental adotadas pela Petrobras.",
        topics: ["Petróleo", "Amazônia Azul"],
    },
];

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

const Cop30Section: React.FC<Cop30SectionProps> = ({
    reviews = defaultReviews,
    stats = defaultStats
}) => {
    const { t } = useTranslation();
    const [activeFilter, setActiveFilter] = useState("Todos");

    const filteredReviews = activeFilter === "Todos"
        ? reviews
        : reviews.filter(review =>
            review.topics.some(topic => topic === activeFilter)
        );

    return (
        <Cop30SectionStyled>
            <Grid container xs={11} sm={11} md={9}>
            {/* COP30 Banner */}
            <section className="cop30-banner">
                <div className="cop30-banner-content">
                    <div className="cop30-badge-wrapper">
                        <div className="cop30-badge">{t("cop30:bannerBadge")}</div>
                        <div className="cop30-location">
                            <span>{t("cop30:bannerLocation")}</span>
                        </div>
                    </div>
                    <h1>{t("cop30:bannerTitle")}</h1>
                    <p>
                        {t("cop30:bannerDescription")}
                    </p>
                </div>
                <Statistics
                    total={stats.total}
                    confiavel={stats.confiavel}
                    enganoso={stats.enganoso}
                    emAnalise={stats.emAnalise}
                />
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
                    <br />
                    {/* Checagens Grid */}
                    <div className="checagens-grid">
                        {filteredReviews.map((review) => (
                            <Claim key={review._id} claim={review} />
                        ))}
                    </div>
                </section>
            </section>
            </Grid>
        </Cop30SectionStyled>
    );
};

export default Cop30Section;
