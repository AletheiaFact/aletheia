import styled from "styled-components";

const CopilotConversationLoadingStyle = styled.span`
    display: flex;
    align-items: center;
    gap: 8px;

    .loading-text {
        position: relative;
        font-family: inherit;
        margin: 0;
        white-space: nowrap;
    }

    .loading-text::after {
        content: "...";
        display: inline-block;
        vertical-align: bottom;
        width: 0;
        overflow: hidden;
        animation: dots-horizontal 2s steps(4) infinite;
    }

    @keyframes dots-horizontal {
        to {
            width: 1.25em;
        }
    }
`;

export default CopilotConversationLoadingStyle;
