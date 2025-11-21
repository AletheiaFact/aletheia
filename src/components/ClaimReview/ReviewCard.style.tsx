import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";
import { spacing } from "../../styles";

const ReviewCardStyled = styled.div`
    display: flex;
    gap: ${spacing.md}; /* 16px - unrelated elements */
    padding: ${spacing.xl}; /* 32px - major section padding */
    width: 100%;
    flex-wrap: wrap;

    .personality-card {
        width: 120px;
    }

    .review-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: ${spacing.md}; /* 16px - unrelated elements */
        justify-content: space-between;
    }

    .review-info {
        height: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
    }

    .sentence-content {
        display: flex;
        gap: ${spacing.md}; /* 16px - unrelated elements */
    }

    .review-actions {
        margin-top: ${spacing.md}; /* 16px */
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: ${spacing.sm}; /* 8px - related elements */
    }

    @media ${queries.sm} {
        padding: ${spacing.md}; /* 16px on mobile */

        .personality-card {
            width: 100%;
        }
    }
`;

export default ReviewCardStyled;
