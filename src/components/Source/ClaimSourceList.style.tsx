import colors from "../../styles/colors";
import styled from "styled-components";

export const ClaimSourceListStyle = styled.div`
    a {
        overflow-wrap: anywhere;
    }

    .source {
        display: flex;
        flex-direction: column;
    }

    .all-sources-link-button {
        margin-top: 10px;
    }

    .all-sources-link {
        font-size: 14px;
        color: ${colors.white};
        font-weight: 400;
        margin: 0px;
    }
`;
