import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const ReviewCardStyled = styled.div`
    display: flex;
    gap: 16px;
    padding: 32px;
    width: 100%;
    flex-wrap: wrap;

    .personality-card {
        width: 120px;
    }

    .review-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 16px;
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
        gap: 16px;
    }

    .review-actions {
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
    }

    @media ${queries.sm} {
        padding: 16px;

        .personality-card {
            width: 100%;
        }
    }
`;

export default ReviewCardStyled;
