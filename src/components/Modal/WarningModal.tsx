import React from "react";
import { Col } from "antd";
import { useTranslation } from "next-i18next";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { AletheiaModal } from "../Modal/AletheiaModal";

const WarningModal = ({ visible, hideDescription, closable, width }) => {
    const { t } = useTranslation();

    return (
        <AletheiaModal
            className="ant-modal-content"
            visible={visible}
            footer={false}
            closable={closable}
            width={width}
        >
            <Col style={{ fontSize: 16 }}>
                <ExclamationCircleOutlined style={{ color: "#DB9F0D" }} />
                <span
                    style={{
                        color: "#DB9F0D",
                        marginLeft: 10,
                        fontWeight: 700,
                        textAlign: "center",
                    }}
                >
                    Lorem ipsum dolor sit amet
                </span>
                <p>{hideDescription}</p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum.
                </p>
            </Col>
        </AletheiaModal>
    );
};

export default WarningModal;
