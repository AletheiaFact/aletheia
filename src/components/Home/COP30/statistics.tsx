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
    return (
        <section className="stats-container">
            <div className="stats-grid">
                <div className="stat-item">
                    <span className="stat-number">{total}</span>
                    <span className="stat-label">Checagens COP30</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{confiavel}</span>
                    <span className="stat-label">Confiáveis</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{enganoso}</span>
                    <span className="stat-label">Enganosas</span>
                </div>
                <div className="stat-item">
                    <span className="stat-number">{emAnalise}</span>
                    <span className="stat-label">Em Análise</span>
                </div>
            </div>
        </section>
    );
};

export default Statistics;