import React, { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import { ErrorOutlineOutlined, WarningAmberOutlined} from "@mui/icons-material";
import { Grid } from "@mui/material";
import { AletheiaModal } from "./AletheiaModal.style";
import AletheiaCaptcha from "../AletheiaCaptcha";
import { useAppSelector } from "../../store/store";
import ModalButtons from "./ModalButtons";
import { useTranslation } from "react-i18next";
import TextArea from "../TextArea";

const UnhideContentModal = ({
    open,
    isLoading,
    contentTitle,
    contentBody,
    handleOk,
    handleCancel,
    hasDescription = false,
    updatingHideStatus = true,
}) => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const [recaptcha, setRecaptcha] = useState("");
    const hasCaptcha = !!recaptcha;
    const recaptchaRef = useRef(null);

    useEffect(() => {
        setRecaptcha("");
        recaptchaRef?.current?.resetRecaptcha();
    }, [open]);

    return (
        <AletheiaModal
            open={open}
            onCancel={handleCancel}
            width={vw?.xs || vw?.xl ? "100%" : "70%"}
            style={{
                alignSelf: "flex-start",
                paddingTop: "10vh"
            }}
            title={
                <Grid item xs={12}>
                    <h2
                        className={`${updatingHideStatus ? "hide-modal" : "delete-modal"
                            }`}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            fontSize: 24
                        }}
                    >
                        {updatingHideStatus ? (
                            <WarningAmberOutlined />
                        ) : (
                            <ErrorOutlineOutlined />
                        )}
                        {contentTitle}
                    </h2>
                    <p style={{ marginTop: 8 }}>{contentBody}</p>

                </Grid>
            }
        >
            <Grid item xs={12}>
                <Form
                    style={{ marginTop: 16, justifyContent: "space-around" }}
                    name="basic"
                    onFinish={handleOk}
                >
                    {hasDescription && (
                        <Form.Item
                            name="description"
                            rules={[
                                {
                                    required: true,
                                    message: t("claimReview:descriptionInputError"),
                                },
                            ]}
                            style={{ marginBottom: 16 }}
                        >
                            <TextArea
                                multiline
                                white="white"
                                placeholder={t(
                                    "claimReview:descriptionInputPlaceholder"
                                )}
                            />
                        </Form.Item>
                    )}

                    <Form.Item name="recaptcha">
                        <AletheiaCaptcha
                            onChange={setRecaptcha}
                            ref={recaptchaRef}
                        />
                    </Form.Item>

                    <ModalButtons
                        isLoading={isLoading}
                        hasCaptcha={hasCaptcha}
                        handleCancel={handleCancel}
                    />
                </Form>
            </Grid>
        </AletheiaModal>
    );
};

export default UnhideContentModal;
