import { Button, Modal } from "antd";
import styled from "styled-components";
import colors from "../../styles/colors";

export const AletheiaModal = styled(Modal)`
    background: none;
    box-shadow: none;
    padding: 0;

    .ant-modal-content {
        width: ${(props) => (props.width ? props.width : "auto")};
        margin: 0 auto;
        border-radius: 30px;
        background-color: ${colors.lightGray};
        box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.25);
        padding: 19px 34px 24px 34px;
    }

    .ant-modal-body {
        padding: 0;
    }

    svg[data-icon="close"] {
        margin-top: 24px;
        width: 20px;
        height: 20px;
        color: ${colors.blackPrimary};
        margin-right: 20px;
    }
`;

export const ModalCancelButton = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 120px;
`;
