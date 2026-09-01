import { Box } from "@mui/material";
import styled from "styled-components";
import colors from "../../styles/colors";
import { queries } from "../../styles/mediaQueries";

const PersonalityMinimalCardStyle = styled(Box)<{ $isInline?: boolean }>`
    display: flex;
    text-align: ${({ $isInline }) => ($isInline ? "left" : "center")};
    flex-direction: ${({ $isInline }) => ($isInline ? "row" : "column")};
    justify-content: ${({ $isInline }) =>
        $isInline ? "flex-start" : "center"};
    align-items: center;
    gap: 14px;

    .personality-info {
        ${({ $isInline }) => $isInline && "text-align: left"}
    }

    .personality-name {
        font-size: 16px;
        color: ${colors.primary};
        font-weight: 600;
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
        color: ${colors.lightPrimary};
        text-decoration: underline;
        font-weight: 700;
    }

    @media ${queries.sm} {
        max-width: 100%;
        align-items: center;
        padding-bottom: 10px;
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
