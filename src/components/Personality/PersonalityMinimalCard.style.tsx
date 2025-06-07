import { Grid } from "@mui/material";
import styled from "styled-components";
import colors from "../../styles/colors";
import { queries } from "../../styles/mediaQueries";

const PersonalityMinimalCardStyle = styled(Grid)`
    text-align: center;
    display: flex;
    justify-content: center;
    gap: 8px;

    .personality {
        text-align: center;
        width: 150px;
    }
    .personality-name {
        font-size: 16px;
        margin-top: 8px;
        color: ${colors.primary};
        font-weight: 400;
    }

    .personality-description-content {
        font-size: 12px;
        color: ${colors.blackSecondary};
        margin: 0;
    }

    .personality-description {
        display: block;
    }

    .personality-profile {
        color: ${colors.blackSecondary};
        text-decoration: underline;
        font-weight: 700;
    }

    @media ${queries.sm} {
        max-width: 100%;
        align-items: center;
        padding-bottom: 10px;

        .personality {
            gap: 32px;
            justify-content: flex-start;
        }

        .personality {
            width: 100%;
        }

        .personality-name {
            margin-top: 0;
        }

        .personality-description-content {
            text-align: center;
            flex-wrap: wrap;
            width: 100%;
            margin-top: 8px;
            display: flex;
            justify-content: center;
        }

        .personality-description {
            display: inline;
        }
    }

    @media ${queries.xs} {
        justify-content: space-around;
        align-items: center;

        .personality-description-content {
            flex-direction: column;
            align-items: center;
        }
    }
`;

export default PersonalityMinimalCardStyle;
