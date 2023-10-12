import colors from "../../../../styles/colors";
import styled from "styled-components";

export const EditorSourcesListStyle = styled.div`
    order: 4;
    width: calc(100% - 90px);

    a {
        overflow-wrap: anywhere;
    }

    .source-card {
        display: flex;
        flex-direction: column;
        padding: 16px 32px;
        margin: 0 16px 16px 0;
        background: ${colors.white};
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
        border-radius: 8px;
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

    .empty-sources-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .empty-text {
        color: rgba(0, 0, 0, 0.5);
    }
`;
