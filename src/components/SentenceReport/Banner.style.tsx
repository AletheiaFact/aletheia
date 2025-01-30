import { Grid } from "@mui/material";
import styled from "styled-components";
import colors from "../../styles/colors";

const BannerStyle = styled(Grid)`
    justify-content: center;
    padding: 18px;
    background-color: ${colors.black};

    .text {
        color: ${colors.white};
        font-style: italic;
        font-size: 18px;
        line-height: 22px;
        text-align: center;
    }

    .cta-registration-button {
        white-space: pre-wrap;
        margin-top: 20px;

        span {
            padding: 24px 0 20px 0;
            font-size: 18px;
            line-height: 22px;
            text-align: center;
            font-weight: 900;
        }
    }

    .video-container {
        margin-top: 20px;
        height: clamp(149px, 28vw, 317px);
        aspect-ratio: 16 / 9;
    }
`;

export default BannerStyle;
