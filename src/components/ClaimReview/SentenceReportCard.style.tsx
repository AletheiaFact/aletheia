import styled from "styled-components";
import colors from "../../styles/colors";

const SentenceReportCardStyle = styled.div`
    .main-content {
        padding-top: 116px;
    }

    .personality-name {
        font-size: 16px;
        margin-top: 16px;
        color: ${colors.bluePrimary};
        font-weight: 400;
    }

    .personality-card {
        text-align: center;
        max-width: 167px;
        justify-content: center;
    }

    .personality-description-content {
        font-size: 10px;
        color: ${colors.blackSecondary};
    }

    .personality-description {
        display: block;
    }

    .personality-avatar {
        outline: ${colors.blueQuartiary} solid 2px;
        outline-offset: 4px;
    }

    .personality-profile {
        color: ${colors.blackSecondary};
        text-decoration: underline;
        font-weight: 700;
    }

    .sentence-card {
        padding-left: 10px;
    }

    .classification {
        font-size: 16px;
        color: ${colors.blackSecondary};
        font-weight: 400;
    }

    .claim-info {
        font-size: 10px;
        strong {
            font-weight: 700;
        }
    }

    @media (max-width: 1024px) {
        .main.content {
            padding: 32px;
            margin-left: -10px;
            margin-right: -10px;
            justify-content: space-around;
        }
    }

    @media (max-width: 991px) {
        .main-content {
            padding-top: 16px;
        }
    }

    @media (max-width: 767px) {
        .personality-card {
            max-width: 100%;
            justify-content: start;
            align-items: start;
            padding-bottom: 10px;
        }

        .personality {
            text-align: left;
            padding-left: 15px;
            width: calc(100% - 117px);
        }

        .personality .ant-col {
            width: 100%;
        }

        .personality-name {
            font-size: 26px;
            margin-top: 0;
        }

        .personality-description-content {
            text-align: center;
            flex-wrap: wrap;
            width: 100%;
            margin-top: 16px;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
        }

        .personality-description {
            display: inline;
        }

        .sentence-card {
            padding-left: 0;
        }

        .classification {
            font-size: 16px;
            text-align: end;
        }
    }

    @media (max-width: 576px) {
        .personality-card {
            justify-content: space-around;
            align-items: center;
            padding-bottom: 10px;
        }

        .personality-description-content {
            flex-direction: column;
            align-items: flex-start;
        }
    }
`;

export default SentenceReportCardStyle;
