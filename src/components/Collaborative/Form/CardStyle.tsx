import { Row } from "antd";
import styled from "styled-components";
import colors from "../../../styles/colors";

const CardStyle = styled(Row)`
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 8px 0px;

    .card-container {
        width: 100%;
        align-items: center;
        display: flex;
        flex-direction: column;
        position: initial;
    }

    .card-content {
        background: ${colors.white};
        box-shadow: 0px 2px 2px ${colors.colorShadow};
        border-radius: 4px;
        border: none;
        width: 100%;
        height: auto;
        padding: 10px;
    }

    .card-content * {
        margin: 0px;
    }
`;

export default CardStyle;
