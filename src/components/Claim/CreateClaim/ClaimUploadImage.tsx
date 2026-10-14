import { useState } from "react";
import { FormControl } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import ImageApi from "../../../api/image";
import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import { UploadFile } from "../../ImageUpload";
import ClaimImageDropzone from "./ClaimImageDropzone";
import BaseClaimForm from "./BaseClaimForm";
import { useBaseClaimForm } from "./UseBaseClaimForm";

const ClaimUploadImage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [, send] = useAtom(createClaimMachineAtom);

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const {
        title, setTitle, date, setDate, sources, setSources, recaptcha, setRecaptcha, isLoading, setIsLoading, errors, setErrors, imageError, setImageError, clearError, validateFields, isDirty
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
        <BaseClaimForm
            variant="image"
            handleSubmit={handleSubmit}
            isDirty={isDirty || fileList.length > 0}
            isLoading={isLoading}
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
                <FormControl style={{ width: "100%" }}>
                    <div className="root-label">
                        <span className="require-label">*</span>
                        <p className="form-label">
                            {t("claimForm:createForm.image.contentLabel")}
                        </p>
                    </div>
                    <ClaimImageDropzone
                        onChange={handleFileChange}
                        error={imageError}
                    />
                    <p
                        className="extra-label"
                        style={{ display: "flex", alignItems: "center", gap: "6px" }}
                    >
                        <InfoOutlined aria-hidden="true" sx={{ fontSize: 16 }} />
                        {t("claimForm:createForm.image.contentHelp")}
                    </p>
                </FormControl>
            }
        />
    );
};

export default ClaimUploadImage;
