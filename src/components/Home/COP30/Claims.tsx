import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Image from "next/image";

interface ClaimProps {
    claim: any;
}

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

const Claim: React.FC<ClaimProps> = ({
    claim,
}) => {
    const router = useRouter();
    const { t } = useTranslation();

    const handleOpenReview = (review: Cop30Review) => {
        if (review.claimId) {
            router.push(`/claim/${review.claimId}`);
        }
    };

    const handleViewProfile = (review: Cop30Review) => {
        if (review.personalityId) {
            router.push(`/personality/${review.personalityId}`);
        }
    };

    const getStatusLabel = (status: string) => {
        if (status === "confiavel") {
            return t("cop30:claimStatusReliable");
        }
        return t("cop30:claimStatusMisleading");
    };

    return (
        <article key={claim._id} className="checagem-card">
            <div className="card-header">
                <div className="author-avatar">
                    {claim.authorAvatar ? (
                        <Image src={claim.authorAvatar} alt={claim.authorName} />
                    ) : (
                        <div className="avatar-placeholder">👤</div>
                    )}
                </div>
                <div className="card-meta">
                    <div className="card-date">
                        {t("cop30:claimDeclaredOn")} <strong>{claim.date}</strong> {t("cop30:claimInOfficialSpeech")}
                    </div>
                    <span className={`status-badge status-${claim.status}`}>
                        {getStatusLabel(claim.status)}
                    </span>
                    <h3 className="author-name">{claim.authorName}</h3>
                    <p className="author-role">{claim.authorRole}</p>
                </div>
            </div>

            <div className="topic-tags">
                {claim.topics.map((topic, index) => (
                    <span key={index} className="topic-tag">
                        {topic}
                    </span>
                ))}
            </div>

            <div className="claim-box">
                <p className="claim-text">"(...) {claim.claimText}"</p>
                <a href="#" className="view-full-link">{t("cop30:claimSeeFullText")}</a>
            </div>

            <div className="card-footer">
                <a
                    href="#"
                    className="profile-link"
                    onClick={(e) => {
                        e.preventDefault();
                        handleViewProfile(claim);
                    }}
                >
                    {t("cop30:claimViewProfile")}
                </a>
                <button
                    className="btn-open"
                    onClick={() => handleOpenReview(claim)}
                >
                    {t("cop30:claimOpen")}
                </button>
            </div>
        </article>
    );
};

export default Claim;
