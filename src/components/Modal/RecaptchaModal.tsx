import React, { useState, useRef, useEffect } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import { AletheiaModal, ModalCancelButton } from "./AletheiaModal.style";
import AletheiaCaptcha from "../AletheiaCaptcha";

interface RecaptchaModalProps {
    open: boolean;
    onConfirm: (token: string) => void;
    onCancel: () => void;
}

const RecaptchaModal = ({ open, onConfirm, onCancel }: RecaptchaModalProps) => {
    const { t } = useTranslation();
    const [token, setToken] = useState("");
    const captchaRef = useRef(null);

    useEffect(() => {
        if (open) {
            setToken("");
            captchaRef.current?.resetRecaptcha();
        }
    }, [open]);

    return (
        <AletheiaModal
            open={open}
            onCancel={onCancel}
            width="400px"
            style={{ alignSelf: "flex-start", paddingTop: "10vh" }}
            title={
                <span
                    style={{
                        fontSize: 16,
                        fontWeight: 600,
                        lineHeight: "18px",
                        paddingRight: 28,
                    }}
                >
                    {t("reviewTask:recaptchaModalTitle")}
                </span>
            }
        >
            <Grid
                item
                style={{
                    marginTop: 16,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                }}
            >
                <AletheiaCaptcha onChange={setToken} ref={captchaRef} />

                <Grid
                    item
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        width: "100%",
                    }}
                >
                    <ModalCancelButton type="button" onClick={() => onCancel()}>
                        <span
                            style={{
                                width: "auto",
                                textDecorationLine: "underline",
                            }}
                        >
                            {t("reviewTask:recaptchaModalCancel")}
                        </span>
                    </ModalCancelButton>

                    <AletheiaButton
                        onClick={() => onConfirm(token)}
                        type={ButtonType.primary}
                        disabled={!token}
                        data-cy="testRecaptchaConfirm"
                    >
                        {t("reviewTask:recaptchaModalConfirm")}
                    </AletheiaButton>
                </Grid>
            </Grid>
        </AletheiaModal>
    );
};

export default RecaptchaModal;
