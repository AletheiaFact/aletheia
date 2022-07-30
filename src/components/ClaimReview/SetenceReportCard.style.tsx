import styled from "styled-components";

const SentenceReportCardStyle = styled.div`
    .main-content {
        padding-top: 116px;
    }

    .personality-name {
        font-size: 16px
    }

    .content-card {
        max-width: 157px;
        justify-content: center;
    }

    .personality-description  {
        font-size: 10px
    }

    @media (max-width: 1024px) {
        .main.content {
            padding: 32px;
            margin-left: -10px;
            margin-right: -10px;
            justify-content: space-around
        }
    }

    @media (max-width: 991px) {
        .main-content {
            padding-top: 16px
        }
    }

    @media (max-width: 767px) {
        .content-card {
            max-width: 100%;
            justify-content: start;
            align-items: center;
            padding-bottom: 10px;
        }
        
        .personality-name {
            font-size: 26px;
        }

        .personality-description {
            font-size: 14px;
        }

        .context-classification {
            font-size: 16px;
            flex-flow: nowrap;
        }

    @media (max-width: 576px) {
        .content-card {
            justify-content: space-around;
            align-items: center;
            padding-bottom: 10px
        }   
    }
`;

export default SentenceReportCardStyle;
