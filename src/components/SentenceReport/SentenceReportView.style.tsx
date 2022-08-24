import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const SentenceReportViewStyle = styled.div`
    .sentence-report-card {
        padding-right: 20px;
    }

    @media ${queries.sm} {
        .sentence-report-card {
            padding-right: 0px;
        }
    }
`;

export default SentenceReportViewStyle;
