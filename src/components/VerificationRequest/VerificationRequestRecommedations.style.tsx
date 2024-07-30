import styled from "styled-components";
import colors from "../../styles/colors";

const VerificationRequestRecommendationsStyled = styled.section`
    width: 100%;

    .recommendation-list {
        padding: 16px 0;
        display: flex;
        flex-direction: row;
        overflow-x: auto;
        gap: 16px;
    }

    .recommendation-list::-webkit-scrollbar {
        height: 4px;
        width: 4px;
        background: ${colors.grayTertiary};
    }

    .recommendation-list::-webkit-scrollbar-thumb {
        background: ${colors.blackTertiary};
        border-radius: 4px;
    }

    .recommendation-list::-moz-scrollbar {
        height: 4px;
        width: 4px;
        background: ${colors.grayTertiary};
    }

    .recommendation-list::-mz-scrollbar {
        height: 4px;
        width: 4px;
        background: ${colors.grayTertiary};
    }
`;

export default VerificationRequestRecommendationsStyled;
