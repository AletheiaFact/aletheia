import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const ReviewCardStyled = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 16px;
    padding: 32px;
    width: 100%;

    .personality-card {
        margin-bottom: 8px;
    }

    .review-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 16px;
    }

    .review-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
    }

    .sentence-content {
        display: flex;
        gap: 16px;
    }

    .review-actions {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
    }

    .review-actions-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
    }

    @media ${queries.sm} {
        padding: 16px;

        .personality-card {
            margin-bottom: 0px;
            width: 100%;
        }
    }

    @media ${queries.xs} {
        .review-actions-content {
            flex-direction: column;
            align-items: center;
            gap: 0px;
        }
    }
`;

export default ReviewCardStyled;
