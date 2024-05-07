import { Row } from "antd";
import colors from "../../styles/colors";
import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";
import Drawer from "@mui/material/Drawer";

const CopilotDrawerStyled = styled(Drawer)`
    width: 350px;
    flex-shrink: 0;
    zindex: 999999;
    max-height: 100vh;
    overflow: hidden;
    flex: 1 1 350px;
    background: ${colors.lightGraySecondary};

    & .MuiDrawer-paper {
        width: 350px;
        padding: 32px 16px 16px 16px;
        background: ${colors.lightGraySecondary};
    }

    .footer {
        font-size: 10px;
        text-align: center;
        margin-top: 8px;
    }

    .copilot-form {
        width: 100%;
        display: flex;
        align-items: flex-end;
        padding: 8px;
        gap: 8px;
        border-radius: 4px;
    }

    .submit-message-button {
        width: 24px;
        height: 44px;
        padding: 0;
        background: none;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
`;

export default CopilotDrawerStyled;
