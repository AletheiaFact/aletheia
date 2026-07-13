import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorOutlineOutlined, WarningAmberOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { AletheiaModal } from "./AletheiaModal.style";
import AletheiaCaptcha from "../AletheiaCaptcha";
import { useAppSelector } from "../../store/store";
import ModalButtons from "./ModalButtons";
import AletheiaTextArea from "../AletheiaTextArea";
import colors from "../../styles/colors";
import { useTranslations } from "next-intl";

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
    const tClaimReview = useTranslations("claimReview");
    const { vw } = useAppSelector((state) => state);
    const [recaptcha, setRecaptcha] = useState("");
    const hasCaptcha = !!recaptcha;
    const recaptchaRef = useRef(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        setRecaptcha("");
        recaptchaRef?.current?.resetRecaptcha();
        reset();
    }, [open, reset]);

    const onSubmit = (data) => {
        if (!hasCaptcha) return;
        handleOk({ ...data, recaptcha });
    };

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
                <form
                    style={{ marginTop: 16, justifyContent: "space-around" }}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {hasDescription && (
                        <div
                            style={{ marginBottom: 16 }}
                        >
                            <AletheiaTextArea
                                multiline
                                white="white"
                                placeholder={tClaimReview(
                                    "descriptionInputPlaceholder"
                                )}
                                {...register("description", {
                                    required: tClaimReview("descriptionInputError"),
                                })}
                            />
                            {errors.description && (
                                <p
                                    style={{
                                        color: colors.error, marginTop: 4
                                    }}
                                >
                                    {tClaimReview("descriptionInputError")}
                                </p>
                            )}
                        </div>
                    )}
                    <AletheiaCaptcha
                        onChange={setRecaptcha}
                        ref={recaptchaRef}
                    />
                    <ModalButtons
                        isLoading={isLoading}
                        hasCaptcha={hasCaptcha}
                        handleCancel={handleCancel}
                    />
                </form>
            </Grid>
        </AletheiaModal>
    );
};

export default UnhideContentModal;
