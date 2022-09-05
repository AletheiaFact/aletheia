import React from "react";
import { Col, Switch } from "antd";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../store/store";
import styled from "styled-components";
import colors from "../../styles/colors";

const SwitchAletheia = styled(Switch)`
    button.ant-switch.ant-switch-checked {
        background-color: #657e8e;
    }
`;

const SaveDraftSwitch = ({ isEnableAutoSave, setIsEnableAutoSave }) => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => ({
        vw: state.vw,
    }));

    return (
        <Col
            span={24}
            style={{
                display: "flex",
                paddingTop: "16px",
                justifyContent: vw?.sm ? "space-around" : "flex-end",
            }}
        >
            <span style={{ marginRight: "20px", color: colors.graySecondary }}>
                Habilitar salvamento automático
            </span>
            <SwitchAletheia
                style={{ marginRight: 4 }}
                onChange={() => setIsEnableAutoSave(!isEnableAutoSave)}
                checkedChildren="On"
                unCheckedChildren="Off"
            />
        </Col>
    );
};

export default SaveDraftSwitch;
