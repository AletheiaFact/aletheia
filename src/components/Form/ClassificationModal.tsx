import { useTranslation } from "next-i18next";
import React from "react";
import AletheiaButton, { ButtonType } from "../Button";
import ClassificationText from "../ClassificationText";
import { AletheiaModal, ModalCancelButton } from "../Modal/AletheiaModal.style";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import styled from "styled-components";

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

    const StyledRadio = styled(Radio)`
    padding: 4px;
    transform: scale(0.8);
`;

    const classificationTextStyle = {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: "bold",
        fontSize: "14px",
    };

    return (
        <AletheiaModal
            open={open}
            onCancel={handleCancel}
            style={{
                display: "flex",
                alignItems: "center",
            }}
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
                <FormControlLabel
                    value="not-fact"
                    control={<StyledRadio />}
                    label={<ClassificationText classification="not-fact" style={classificationTextStyle} />}
                />
                <FormControlLabel
                    value="trustworthy"
                    control={<StyledRadio />}
                    label={<ClassificationText classification="trustworthy" style={classificationTextStyle} />}
                />
                <FormControlLabel
                    value="trustworthy-but"
                    control={<StyledRadio />}
                    label={<ClassificationText classification="trustworthy-but" style={classificationTextStyle} />}
                />
                <FormControlLabel
                    value="arguable"
                    control={<StyledRadio />}
                    label={<ClassificationText classification="arguable" style={classificationTextStyle} />}
                />
                <FormControlLabel
                    value="misleading"
                    control={<StyledRadio />}
                    label={<ClassificationText classification="misleading" style={classificationTextStyle} />}
                />
                <FormControlLabel
                    value="false"
                    control={<StyledRadio />}
                    label={<ClassificationText classification="false" style={classificationTextStyle} />}
                />
                <FormControlLabel
                    value="unsustainable"
                    control={<StyledRadio />}
                    label={<ClassificationText classification="unsustainable" style={classificationTextStyle} />}
                />
                <FormControlLabel
                    value="exaggerated"
                    control={<StyledRadio />}
                    label={<ClassificationText classification="exaggerated" style={classificationTextStyle} />}
                />
                <FormControlLabel
                    value="unverifiable"
                    control={<StyledRadio />}
                    label={<ClassificationText classification="unverifiable" style={classificationTextStyle} />}
                />
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
