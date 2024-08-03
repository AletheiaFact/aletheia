import colors from "../../styles/colors";
import styled from "styled-components";

const CopilotConversationLoadingStyle = styled.span`
    display: flex;
    gap: 8px;

    .loading {
        font-size: 16px;
        color: ${colors.bluePrimary};
        display: flex;
    }

    .loading-text {
        position: relative;
        width: fit-content;
        margin: 0;
    }

    .loading-text::after {
        content: "";
        display: inline-block;
        animation: dots 2s steps(4) infinite;
        position: absolute;
        left: 100%;
    }

    @keyframes dots {
        0% {
            content: "";
        }
        25% {
            content: ".";
        }
        50% {
            content: "..";
        }
        75% {
            content: "...";
        }
        100% {
            content: "";
        }
    }
`;

export default CopilotConversationLoadingStyle;
