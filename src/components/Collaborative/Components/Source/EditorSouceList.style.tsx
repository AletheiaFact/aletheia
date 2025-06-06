import colors from "../../../../styles/colors";
import styled from "styled-components";
import { queries } from "../../../../styles/mediaQueries";

export const EditorSourcesListStyle = styled.div`
    order: 4;
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    a {
        overflow-wrap: anywhere;
    }

    .source-card {
        display: flex;
        flex-direction: column;
        padding: 16px 32px;
        margin: 0 16px 16px 0;
        background: ${colors.white};
        box-shadow: 0px 2px 2px ${colors.shadow};
        border-radius: 8px;
        width: 100%;
    }

    .source-card-header {
        display: flex;
        justify-content: space-between;
    }

    .source-card-popover-content {
        display: flex;
        flex-direction: column;
        padding: 0;
    }

    .add-sources-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .empty-text {
        color: rgba(0, 0, 0, 0.5);
        margin: 0;
    }

    @media (${queries.sm}) {
        .add-sources-container {
            flex-direction: column;
        }

        .empty-text {
            text-align: center;
        }
    }
`;
