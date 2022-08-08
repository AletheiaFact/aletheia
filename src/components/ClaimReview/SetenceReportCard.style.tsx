import styled from "styled-components";

const SentenceReportCardStyle = styled.div`
    .main-content {
        padding-top: 116px;
    }

    .personality-name {
        font-size: 16px;
        margin-top: 16px;
    }

    .content-card {
        max-width: 157px;
        justify-content: center;
    }

    .personality-description-content {
        font-size: 10px;
        margin-top: 4px;
    }

    .personality-description {
        display: block;
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
        .content-card {
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

        .context-classification {
            font-size: 16px;
            flex-flow: nowrap;
        }
    }

    @media (max-width: 576px) {
        .content-card {
            justify-content: space-around;
            align-items: center;
            padding-bottom: 10px;
        }
    }
`;

export default SentenceReportCardStyle;
