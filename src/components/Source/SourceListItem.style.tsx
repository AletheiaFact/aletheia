import colors from "../../styles/colors";
import styled from "styled-components";
import reviewColors from "../../constants/reviewColors";
import { Col } from "antd";

const SourceListItemStyled = styled(Col)`
    display: flex;
    flex-direction: column;
    gap: 16px;

    .title {
        font-size: 18px;
        font-weight: 600;
        color: ${colors.primary};
        margin: 0;
    }

    .title ::before {
        content: "";
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background: ${({ classification }) => reviewColors[classification]};
        position: relative;
        margin-right: 5px;
    }

    .summary {
        color: ${colors.blackSecondary};
    }

    .footer {
        display: flex;
        gap: 16px;
        justify-content: space-between;
        align-items: center;
    }
`;

export default SourceListItemStyled;
