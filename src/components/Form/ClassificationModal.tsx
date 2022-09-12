import { Radio } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import AletheiaButton, { ButtonType } from "../Button";
import ClassificationText from "../ClassificationText";
import { AletheiaModal, ModalCancelButton } from "../Modal/AletheiaModal.style";

const ClassificationModal = ({
    visible,
    value,
    setValue,
    handleOk,
    handleCancel,
}) => {
    const { t } = useTranslation();
    const onChangeRadio = (e) => {
        setValue(e.target.value);
    };

    return (
        <AletheiaModal
            visible={visible}
            footer={false}
            onCancel={handleCancel}
            setValue={setValue}
            title={t("claimReviewForm:classificationLabel")}
            style={{
                display: "flex",
                alingItens: "center",
            }}
        >
            <Radio.Group
                onChange={onChangeRadio}
                value={value}
                style={{
                    display: "flex",
                    gap: "24px",
                    flexDirection: "column",
                }}
            >
                <Radio value="not-fact">
                    <ClassificationText classification="not-fact" />
                </Radio>
                <Radio value="trustworthy">
                    <ClassificationText classification="trustworthy" />
                </Radio>
                <Radio value="trustworthy-but">
                    <ClassificationText classification="trustworthy-but" />
                </Radio>
                <Radio value="arguable">
                    <ClassificationText classification="arguable" />
                </Radio>
                <Radio value="misleading">
                    <ClassificationText classification="misleading" />
                </Radio>
                <Radio value="false">
                    <ClassificationText classification="false" />
                </Radio>
                <Radio value="unsustainable">
                    <ClassificationText classification="unsustainable" />
                </Radio>
                <Radio value="exaggerated">
                    <ClassificationText classification="exaggerated" />
                </Radio>
                <Radio value="unverifiable">
                    <ClassificationText classification="unverifiable" />
                </Radio>
            </Radio.Group>
            <div
                style={{
                    marginTop: 30,
                    display: "flex",
                }}
            >
                <ModalCancelButton
                    type="text"
                    onClick={handleCancel}
                    style={{ width: "62%" }}
                >
                    <span>{t("orderModal:cancelButton")}</span>
                </ModalCancelButton>

                <AletheiaButton
                    type={ButtonType.blue}
                    onClick={handleOk}
                    style={{ width: "48%", paddingTop: 0 }}
                >
                    {t("orderModal:okButton")}
                </AletheiaButton>
            </div>
        </AletheiaModal>
    );
};

export default ClassificationModal;
