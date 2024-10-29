import styled from "styled-components";
import colors from "../../styles/colors";

const ReviewContentStyled = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 16px;
    flex-wrap: wrap;

    p {
        color: ${colors.blackSecondary};
    }

    cite {
        font-style: normal;
    }

    a {
        color: ${colors.primary};
        font-weight: 700;
        margin-left: 10px;
    }

    a:hover {
        color: ${colors.primary};
    }
`;

export default ReviewContentStyled;
