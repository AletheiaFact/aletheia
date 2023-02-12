import colors from "../styles/colors";
import styled from "styled-components";

export const SourcesListStyle = styled.div`
    .source {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin-bottom: 30px;
    }

    .source-placeholder-image {
        width: 100%;
        height: 156px;
        border-radius: 10px 10px 0 0;
    }

    .source-footer {
        font-size: 10px;
        display: flex;
        justify-content: center;
        color: ${colors.bluePrimary};
        gap: 3px;

        a {
            color: ${colors.blueSecondary};
            overflow-wrap: anywhere;
        }
    }

    .all-sources-link {
        font-size: 14px;
        color: ${colors.white};
        font-weight: 400;
        margin: 0px;
    }
`;
