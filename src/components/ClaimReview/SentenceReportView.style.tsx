
import styled from "styled-components";

const SentenceReportViewStyle = styled.div`
    .sentence-report-card {
        padding-right: 20px;
    }

    @media (max-width: 1280px) {
        .sentence-report-card {
            padding-right: 25px;
            padding-left: 20px
        }
    }

    @media (max-width: 720px) {
        .sentence-report-card {
            padding-right: 0px;
            padding-left: 0px
        }
    }
`;

export default SentenceReportViewStyle