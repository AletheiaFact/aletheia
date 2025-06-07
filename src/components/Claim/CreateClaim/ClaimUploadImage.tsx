import { useState } from "react";
import { Grid } from "@mui/material";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import ImageApi from "../../../api/image";
import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import colors from "../../../styles/colors";
import ImageUpload, { UploadFile } from "../../ImageUpload";
import Label from "../../Label";
import BaseClaimForm from "./BaseClaimForm";
import { useBaseClaimForm } from "./UseBaseClaimForm";

const ClaimUploadImage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [, send] = useAtom(createClaimMachineAtom);

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const {
        title, setTitle, date, setDate, sources, setSources, recaptcha, setRecaptcha, isLoading, setIsLoading, errors, setErrors, imageError, setImageError, clearError, validateFields
    } = useBaseClaimForm({ shouldValidateContent: false });

    const handleSubmit = (values: any) => {
        const newErrors = validateFields();

        if (Object.keys(newErrors).length > 0 || fileList.length === 0) {
            if (fileList.length === 0) {
                setImageError(true);
            }
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        const formData = new FormData();

        fileList.forEach((file) => {
            if (file.originFileObj) {
                formData.append("files", file.originFileObj);
            }
        });

        ImageApi.uploadImage(formData, t)
            .then((imagesUploaded) => {
                setImageError(false);

                const claimData = {
                    ...values,
                    content: imagesUploaded[0],
                };

                send({
                    type: CreateClaimEvents.persist,
                    claimData,
                    t,
                    router,
                });
            })
            .catch((err) => {
                setIsLoading(false);
                if (err.response?.status === 303) {
                    const seeOtherTarget = err.response.data.target;
                    if (seeOtherTarget) {
                        router.push(seeOtherTarget);
                    }
                }
            });
    };

    const handleFileChange = (newFileList: UploadFile[]) => {
        setFileList(newFileList);
        if (newFileList.length > 0) {
            setImageError(false);
        }
    };

    return (
        <>
            <div style={{ marginTop: "24px" }}>
                <h3
                    style={{
                        fontSize: "18px",
                        lineHeight: "24px",
                        color: colors.blackSecondary,
                        marginBottom: "8px",
                        textTransform: "capitalize",
                    }}
                >
                    {t("claimForm:image")}
                </h3>
                <p
                    style={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: colors.blackSecondary,
                        marginBottom: "24px",
                    }}
                >
                    {t("claimForm:uploadImageText")}
                </p>
            </div>

            <BaseClaimForm
                disableFutureDates
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                dateExtraText={t("claimForm:dateFieldHelpImage")}
                errors={errors}
                clearError={clearError}
                recaptcha={recaptcha}
                setRecaptcha={setRecaptcha}
                setTitle={setTitle}
                date={date}
                setDate={setDate}
                setSources={setSources}
                title={title}
                sources={sources}
                content={
                    <Grid container style={{ marginBottom: 24 }}>
                        <Label required>{t("claimForm:fileInputButton")}</Label>
                        <ImageUpload
                            onChange={handleFileChange}
                            error={imageError}
                            defaultFileList={[]}
                        />
                    </Grid>
                }
            />
        </>
    );
};

export default ClaimUploadImage;
