import { Grid } from "@mui/material"
import styled from "styled-components";
import { queries } from "../../../styles/mediaQueries";
import colors from "../../../styles/colors";

const CTASectionStyle = styled(Grid)`
    display: flex;
    width: 100%;
    margin-top: 24px;
    align-items: center;

    .CTA-title {
        font-size: 16px;
        line-height: 20px;
        color: ${colors.white};
        margin: 0;
    }

    .CTA-button-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: ${({ isloggedin }) =>
        isloggedin === "true" ? "flex-end" : "space-between"};
    }

    @media ${queries.md} {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .CTA-button-container {
            width: 100%;
        }
    }

    @media ${queries.xs} {
        .CTA-title {
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 8px;
            width: 80%;
        }
    }
`;

export default CTASectionStyle;
