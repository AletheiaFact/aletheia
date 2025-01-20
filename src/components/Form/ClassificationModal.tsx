import { useTranslation } from "next-i18next";
import React from "react";
import AletheiaButton, { ButtonType } from "../Button";
import ClassificationText from "../ClassificationText";
import { AletheiaModal, ModalCancelButton } from "../Modal/AletheiaModal.style";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";

const ClassificationModal = ({
    open,
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
            open={open}
            footer={false}
            onCancel={handleCancel}
            setValue={setValue}
            title={t("claimReviewForm:classificationLabel")}
            style={{
                display: "flex",
                alingItens: "center",
            }}
        >
            <RadioGroup
                onChange={onChangeRadio}
                value={value}
                style={{
                    display: "flex",
                    gap: "24px",
                    flexDirection: "column",
                }}
            >
                <FormControlLabel
                    value="not-fact"
                    control={<Radio />}
                    label={<ClassificationText classification="not-fact" />}
                />
                <FormControlLabel
                    value="trustworthy"
                    control={<Radio />}
                    label={<ClassificationText classification="trustworthy" />}
                />
                <FormControlLabel
                    value="trustworthy-but"
                    control={<Radio />}
                    label={<ClassificationText classification="trustworthy-but" />}
                />
                <FormControlLabel
                    value="arguable"
                    control={<Radio />}
                    label={<ClassificationText classification="arguable" />}
                />
                <FormControlLabel
                    value="misleading"
                    control={<Radio />}
                    label={<ClassificationText classification="misleading" />}
                />
                <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label={<ClassificationText classification="false" />}
                />
                <FormControlLabel
                    value="unsustainable"
                    control={<Radio />}
                    label={<ClassificationText classification="unsustainable" />}
                />
                <FormControlLabel
                    value="exaggerated"
                    control={<Radio />}
                    label={<ClassificationText classification="exaggerated" />}
                />
                <FormControlLabel
                    value="unverifiable"
                    control={<Radio />}
                    label={<ClassificationText classification="unverifiable" />}
                />
            </RadioGroup>
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
