import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const CopilotReviewV2ShellStyled = styled.div`
    display: flex;
    width: 100%;
    height: calc(100vh - 56px);
    overflow: hidden;

    .shell-main {
        display: flex;
        flex: 1;
        flex-direction: column;
        overflow: hidden;
    }

    .shell-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 24px;
        border-bottom: 1px solid rgb(238, 238, 238);
        background: rgb(255, 255, 255);
        min-height: 48px;

        .toolbar-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .toolbar-right {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .sidebar-toggle {
            display: none;
            border: none;
            background: none;
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            font-size: 18px;
            color: rgb(101, 126, 142);

            &:hover {
                background: rgb(245, 245, 245);
            }
        }
    }

    .shell-content {
        display: flex;
        flex: 1;
        overflow: hidden;
    }

    .chat-column {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    @media ${queries.sm} {
        flex-direction: column;

        .shell-toolbar .sidebar-toggle {
            display: flex;
        }
    }
`;

export default CopilotReviewV2ShellStyled;
