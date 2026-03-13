import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const ReviewCardStyled = styled.div`
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 16px;
    padding: 32px;
    width: 100%;

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

    @media ${queries.lg} {
    display: flex;
    gap: 16px;
    padding: 32px;
    width: 100%;
    flex-wrap: wrap;
    }

    @media ${queries.sm} {
        padding: 16px;

        .personality-card {
            width: 100%;
        }
    }

    @media ${queries.xs} {
    .review-actions {
      margin-top: 8px;
      display: grid;
      justify-content: center;
      justify-items: center;
      gap: 0px;
    }
  }
`;

export default ReviewCardStyled;
