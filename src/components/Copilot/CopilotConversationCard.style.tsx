import { Grid } from "@mui/material"
import colors from "../../styles/colors";
import styled from "styled-components";

const CopilotConversationCardStyle = styled(Grid)`
    display: flex;
    flex-direction: column;

    .conversation-card-header {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .conversation-card-content {
        position: relative;
        margin: 12px 0 16px 0;
        padding: 16px;
        border-radius: 10px;
        background-color: ${colors.white};
        margin-left: 40px;
        word-break: break-word;
        color: ${colors.primary};
        &:after {
            width: 0;
            height: 0;
            content: " ";
            position: absolute;
            border-top: none;
            border-right: 9px solid transparent;
            border-left: 9px solid transparent;
            border-bottom: 9px solid ${colors.white};
            left: 8px;
            top: -8px;
            transform: rotate(0deg);
        }
    }

    .conversation-card-content.error {
        color: ${colors.error};
    }
`;

export default CopilotConversationCardStyle;
