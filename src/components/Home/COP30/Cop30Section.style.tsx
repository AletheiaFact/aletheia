import styled from "styled-components";

const Cop30SectionStyled = styled.div`
width: 100%;
padding-top: 32px;
justify-items: center;
    /* COP30 Header Section */
    .cop30-banner {
        background: linear-gradient(135deg, #11273a 0%, #657e8e 100%);
        border-radius: 12px;
        padding: 48px 40px;
        margin-bottom: 32px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(17, 39, 58, 0.15);
    }

    .cop30-banner::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -10%;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(103, 190, 242, 0.15) 0%, transparent 70%);
        border-radius: 50%;
    }

    .cop30-banner-content {
        position: relative;
        z-index: 1;
    }

    .cop30-badge-wrapper {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }

    .cop30-badge {
        background: #67bef2;
        color: #ffffff;
        font-size: 24px;
        font-weight: 800;
        padding: 10px 24px;
        border-radius: 8px;
        letter-spacing: 1px;
        box-shadow: 0 4px 12px rgba(103, 190, 242, 0.3);
    }

    .cop30-location {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #9bbcd1;
        font-size: 16px;
        font-weight: 600;
    }

    .cop30-banner h1 {
        color: #ffffff;
        font-size: 32px;
        margin-bottom: 12px;
        font-weight: 700;
    }

    .cop30-banner .bannerDescription {
        color: #9bbcd1;
        font-size: 16px;
        max-width: 900px;
        line-height: 1.7;
    }

    .cop30-banner p {
        color: #515151;
        font-size: 12px;
        max-width: 900px;
        line-height: 1.7;
    }

    /* Statistics Bar */
    .stats-container {
        background: #ffffff;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 32px;
        box-shadow: 0 2px 8px rgba(17, 39, 58, 0.08);
        border: 1px solid #c2c8cc;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;
    }

    .stat-item {
        text-align: center;
        padding: 16px;
        border-radius: 8px;
        background: #dae8ea;
        transition: transform 0.2s ease;
    }

    .stat-item:hover {
        transform: translateY(-2px);
        background: #dae8ea;
    }

    .stat-number {
        font-size: 42px;
        font-weight: 800;
        color: #4f8db4;
        margin-bottom: 4px;
        display: block;
    }

    .stat-label {
        font-size: 14px;
        color: #4d4e4f;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    /* Filters Section */
    .filters-container {
        background: #ffffff;
        border-radius: 12px;
        padding: 24px 28px;
        margin-bottom: 32px;
        box-shadow: 0 2px 8px rgba(17, 39, 58, 0.08);
        border: 1px solid #c2c8cc;
    }

    .filters-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 16px;
    }

    .filters-title {
        font-size: 15px;
        font-weight: 700;
        color: #11273a;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .filters-grid {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
    }

    .filter-chip {
        padding: 10px 20px;
        border-radius: 20px;
        border: 2px solid #c2c8cc;
        background: #ffffff;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        color: #4d4e4f;
        transition: all 0.3s ease;
        white-space: nowrap;
    }

    .filter-chip:hover {
        border-color: #4f8db4;
        color: #4f8db4;
        background: #dae8ea;
    }

    .filter-chip.active {
        background: #11273a;
        color: #ffffff;
        border-color: #11273a;
    }

    /* Section Header */
    .section-header {
        margin-bottom: 24px;
    }

    .section-title {
        color: #11273a;
        font-size: 28px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .section-title::before {
        content: '';
        width: 5px;
        height: 28px;
        background: #67bef2;
        border-radius: 3px;
    }

    /* Checagens Grid */
    .checagens-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }

    /* Checagem Card */
    .checagem-card {
        background: #ffffff;
        border-radius: 12px;
        padding: 28px;
        box-shadow: 0 2px 8px rgba(17, 39, 58, 0.08);
        border: 1px solid #c2c8cc;
        transition: all 0.3s ease;
    }

    .checagem-card:hover {
        box-shadow: 0 8px 24px rgba(17, 39, 58, 0.12);
        transform: translateY(-2px);
        border-color: #4f8db4;
    }

    /* Card Header */
    .card-header {
        display: flex;
        gap: 20px;
        margin-bottom: 20px;
        align-items: flex-start;
    }

    .author-avatar {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #dae8ea;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: 3px solid #c2c8cc;
        overflow: hidden;
    }

    .author-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .avatar-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        color: #979a9b;
    }

    .card-meta {
        flex: 1;
    }

    .card-date {
        font-size: 13px;
        color: #4d4e4f;
        margin-bottom: 10px;
    }

    .card-date strong {
        color: #4f8db4;
        font-weight: 700;
    }

    /* Status Badge */
    .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 12px;
    }

    .status-reliable {
        background: #dcfce7;
        color: #15803d;
    }

    .status-misleading {
        background: #fee2e2;
        color: #991b1b;
    }

    /* Author Info */
    .author-name {
        font-size: 17px;
        color: #11273a;
        margin-bottom: 4px;
        font-weight: 700;
    }

    .author-role {
        font-size: 13px;
        color: #4d4e4f;
        line-height: 1.5;
    }

    /* Topic Tags */
    .topic-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 16px;
    }

    .topic-tag {
        background: #dae8ea;
        color: #11273a;
        padding: 6px 14px;
        border-radius: 14px;
        font-size: 12px;
        font-weight: 600;
        border: 1px solid #b1c2cd;
    }

    /* Card Footer */
    .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 16px;
        border-top: 1px solid #c2c8cc;
        gap: 16px;
        flex-wrap: wrap;
    }

    /* Topics Section */
    .topics-section {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #dae8ea;
    }

    .topics-label {
        font-size: 12px;
        color: #979a9b;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
        .container {
            padding: 16px;
        }

        .cop30-banner {
            padding: 32px 24px;
        }

        .cop30-banner h1 {
            font-size: 24px;
        }

        .cop30-badge {
            font-size: 20px;
            padding: 8px 18px;
        }

        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .section-title {
            font-size: 22px;
        }

        .checagem-card {
            padding: 20px;
        }

        .card-header {
            flex-direction: column;
        }

        .card-footer {
            flex-direction: column;
            align-items: stretch;
        }

        .btn-open {
            width: 100%;
        }
    }

    /* Loading Animation */
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .checagem-card {
        animation: fadeInUp 0.5s ease forwards;
        opacity: 0;
    }

    .checagem-card:nth-child(1) { animation-delay: 0.1s; }
    .checagem-card:nth-child(2) { animation-delay: 0.2s; }
    .checagem-card:nth-child(3) { animation-delay: 0.3s; }
    .checagem-card:nth-child(4) { animation-delay: 0.4s; }
`;

export default Cop30SectionStyled;
