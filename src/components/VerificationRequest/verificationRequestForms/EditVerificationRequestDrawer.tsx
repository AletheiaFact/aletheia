import React, { useState } from "react";
import { IEditVerificationRequestDrawer } from "../../../types/VerificationRequest";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "@mui/material";
import verificationRequestApi from "../../../api/verificationRequestApi";
import LargeDrawer from "../../LargeDrawer";
import DynamicVerificationRequestForm from "./DynamicVerificationRequestForm";

const EditVerificationRequestDrawer = ({
    open,
    onClose,
    verificationRequest,
    onSave,
}: IEditVerificationRequestDrawer) => {
    const { t } = useTranslation();
    const [recaptchaString, setRecaptchaString] = useState("");
    const hasCaptcha = !!recaptchaString;
    const [isLoading, setIsLoading] = useState(false);
    const sourceMapped = verificationRequest.source?.map(source => source.href);

    const updatedVerificationRequest = {
        ...verificationRequest,
        source: sourceMapped?.length > 0 ? sourceMapped : undefined
    }

    const onSubmit = async (data) => {
        try {
            const updateData = {
                publicationDate: data.publicationDate,
                source: data.source?.map(url => ({ href: url })),
            };

            const response = await verificationRequestApi.updateVerificationRequest(
                verificationRequest._id,
                updateData,
                t,
                'update'
            );

            if (response) {
                onSave(response);
                onClose();
            }
        } catch (error) {
            console.error("Edit Verification Request error", error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LargeDrawer open={open} onClose={onClose}>
            <Grid container style={{ padding: "30px" }}>
                <h2>
                    {t("verificationRequest:titleEditVerificationRequest")}
                </h2>
                <Divider />
                <DynamicVerificationRequestForm
                    data={updatedVerificationRequest}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    setRecaptchaString={setRecaptchaString}
                    hasCaptcha={hasCaptcha}
                    isEdit={true}
                    isDrawerOpen={open}
                    onClose={onClose}
                />
            </Grid>
        </LargeDrawer>
    )
};

export default EditVerificationRequestDrawer;
