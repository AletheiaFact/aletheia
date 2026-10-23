import { useTranslation } from "next-i18next";
import React from "react";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import ClassificationText from "../ClassificationText";
import { AletheiaModal, ModalCancelButton } from "../Modal/AletheiaModal.style";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import styled from "styled-components";
import { getMethodology } from "../../../lib/classification-methodology";

const ClassificationModal = ({
    methodology,
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

    const StyledRadio = styled(Radio)`
        padding: 4px;
        transform: scale(0.8);
    `;

    const classificationTextStyle = {
        fontFamily: "Open Sans, sans-serif",
        fontWeight: "bold",
        fontSize: "14px",
    };

    return (
        <AletheiaModal
            open={open}
            onCancel={handleCancel}
            title={
                <h2
                    style={{
                        fontFamily: "open sans, sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        textAlign: "center",
                        textTransform: "uppercase",
                    }}
                >
                    {t("claimReviewForm:classificationLabel")}
                </h2>
            }
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
                {getMethodology(methodology).options.map(
                    ({ value: optionValue }) => (
                        <FormControlLabel
                            key={optionValue}
                            value={optionValue}
                            control={<StyledRadio />}
                            label={
                                <ClassificationText
                                    classification={optionValue}
                                    methodology={methodology}
                                    style={classificationTextStyle}
                                />
                            }
                        />
                    )
                )}
            </RadioGroup>
            <div
                style={{
                    marginTop: 30,
                    display: "flex",
                }}
            >
                <ModalCancelButton
                    type="button"
                    onClick={handleCancel}
                    style={{ width: "62%" }}
                >
                    <span>{t("orderModal:cancelButton")}</span>
                </ModalCancelButton>

                <AletheiaButton
                    type={ButtonType.primary}
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
