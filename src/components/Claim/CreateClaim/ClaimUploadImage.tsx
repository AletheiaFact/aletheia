import { useState } from "react";
import { Grid } from "@mui/material";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import ImageApi from "../../../api/image";
import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import colors from "../../../styles/colors";
import ImageUpload from "../../ImageUpload";
import Label from "../../Label";
import BaseClaimForm from "./BaseClaimForm";

const ClaimUploadImage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [, send] = useAtom(createClaimMachineAtom);

    const formData = new FormData();
    const [fileList, setFileList] = useState<File[]>([]);
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (values: any) => {
        if (fileList.length > 0) {
            setIsLoading(true);

            fileList.forEach((file) => {
                formData.append("files", file);
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
        } else {
            setImageError(true);
        }
    };

    const handleFileChange = (newFileList: File[]) => {
        setFileList(newFileList);
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
