import styled from "styled-components";
import colors from "../../styles/colors";
import { queries } from "../../styles/mediaQueries";

const SentenceReportCardStyle = styled.div`
    .main-content {
        padding-top: 80px;
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

    @media ${queries.md} {
        .main-content {
            padding-top: 16px;
        }
    }

    @media ${queries.sm} {
        .sentence-card {
            padding-left: 0;
        }

        .classification {
            font-size: 16px;
            text-align: end;
        }
    }
`;

export default SentenceReportCardStyle;
