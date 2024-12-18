import { Button, Modal } from "antd";
import styled from "styled-components";
import colors from "../../styles/colors";
import { NameSpaceEnum } from "../../types/Namespace";

const AletheiaModal = styled(Modal)`
    background: none;
    box-shadow: none;
    padding: 0;

    .ant-modal-content {
        width: ${(props) => (props.width ? props.width : "300px")};
        margin: 0 auto;
        border-radius: 8px;
        background-color: ${(props) =>
        props.theme === "dark" ? colors.black : colors.lightNeutral};
        box-shadow: 0px 0px 15px ${colors.shadow};
        padding: 26px 26px;
        max-width: 90vw;
    }

    .ant-modal-body {
        padding: 0;
    }

    .ant-modal-header {
        background: none;
        border-bottom: 0px;
        padding: 0 0 10px 0;
    }

    .ant-modal-title {
        color: ${(props) =>
        props.theme === "dark" ? colors.white : colors.black};
        font-weight: 700;
        font-size: 14px;
        text-align: center;
        text-transform: uppercase;
        padding: 0 32px;
    }

    svg[data-icon="close"] {
        margin-top: 26px;
        width: 14px;
        height: 14px;
        color: ${(props) =>
        props.theme === "dark" ? colors.white : colors.primary};
        margin-right: 20px;
    }

    .ant-modal-body .modal-title {
        display: flex;
        gap: 10px;
        width: calc(100% - 20px);
        font-size: 24px;
        line-height: 24px;
    }

    .hide-modal {
        color: ${colors.warning};
    }

    .delete-modal {
        color: #ca1105;
    }
`;

const ModalCancelButton = styled(Button)`
    height: 40px;
    width: 120px;
    color: ${({ namespace }) =>
        namespace === NameSpaceEnum.Main
            ? colors.primary
            : colors.secondary};
    text-align: "center";
    font-weight: 700;
    font-size: 14;
`;

export { AletheiaModal, ModalCancelButton };
