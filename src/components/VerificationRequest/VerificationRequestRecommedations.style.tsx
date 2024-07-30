import styled from "styled-components";
import colors from "../../styles/colors";

const VerificationRequestResultListStyled = styled.section`
    padding: 16px 0;
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    gap: 16px;

    ::-webkit-scrollbar {
        height: 4px;
        width: 4px;
        background: ${colors.grayTertiary};
    }

    ::-webkit-scrollbar-thumb {
        background: ${colors.blackTertiary};
        border-radius: 4px;
    }

    ::-moz-scrollbar {
        height: 4px;
        width: 4px;
        background: ${colors.grayTertiary};
    }

    ::-mz-scrollbar {
        height: 4px;
        width: 4px;
        background: ${colors.grayTertiary};
    }
`;

export default VerificationRequestResultListStyled;
