import styled from "styled-components";
import { queries } from "../../../styles/mediaQueries";

const SessionSidebarStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: 280px;
    min-width: 280px;
    height: 100%;
    background: rgb(17, 39, 58);
    color: rgb(255, 255, 255);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;

    .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);

        h3 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
        }
    }

    .new-chat-button {
        display: flex;
        align-items: center;
        gap: 8px;
        width: calc(100% - 32px);
        margin: 12px 16px;
        padding: 10px 12px;
        background: rgba(37, 99, 235, 0.2);
        border: 1px solid rgba(37, 99, 235, 0.4);
        border-radius: 8px;
        color: rgb(147, 197, 253);
        font-size: 14px;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
            background: rgba(37, 99, 235, 0.3);
        }
    }

    .session-list {
        flex: 1;
        overflow-y: auto;
        padding: 8px;

        &::-webkit-scrollbar {
            width: 4px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
        }
    }

    @media ${queries.sm} {
        width: 100%;
        min-width: unset;
    }
`;

export default SessionSidebarStyled;
