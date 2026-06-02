import styled from "styled-components";
import { queries } from "../../styles/mediaQueries";

const ReviewCardStyled = styled.div`
    gap: 16px;
    padding: 32px;
    width: 100%;

    .personality-card {
        margin-bottom: 18px;
    }

    .review-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 16px;
        justify-content: space-between;
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
        margin-top: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
    }

    @media ${queries.sm} {
        padding: 16px;

        .personality-card {
            margin-bottom: 0px;
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
