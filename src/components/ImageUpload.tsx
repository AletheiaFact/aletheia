/* eslint-disable @next/next/no-img-element */
import { FileUploadOutlined } from "@mui/icons-material";
import { Upload } from "antd";
import { Grid, Typography } from "@mui/material";
import { MessageManager } from "../components/Messages";
import { RcFile, UploadChangeParam, UploadProps } from "antd/lib/upload";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";

import AletheiaButton from "./Button";
import { AletheiaModal } from "./Modal/AletheiaModal.style";

import type { UploadFile } from "antd/lib/upload/interface";

interface ImageUploadProps {
    onChange: (fileList: UploadFile[]) => void;
    error?: boolean;
    defaultFileList?: UploadFile[];
}

const ImageUpload = ({
    onChange,
    error = false,
    defaultFileList,
}: ImageUploadProps) => {
    const { t } = useTranslation();
    const UPLOAD_LIMIT = 1;
    const ONE_MB = 1048576;
    const ALLOWED_MB = 10;
    const MAX_SIZE = ALLOWED_MB * ONE_MB;
    const ALLOWED_FORMATS = ["image"];

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>(
        defaultFileList || []
    );

    const getBase64 = (file: RcFile): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.preview) {
            file.preview = file.originFileObj
                ? await getBase64(file.originFileObj)
                : file.url;
        }
        setPreviewImage(file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name);
    };

    const validateBeforeUpload = (file: RcFile) => {
        const isAllowedFormat = ALLOWED_FORMATS.includes(
            file.type.split("/")[0]
        );

        if (!isAllowedFormat) {
            MessageManager.showMessage("error",
                t("claimForm:fileTypeError", {
                    types: ALLOWED_FORMATS.join("/"),
                })
            );
        }
        const isAllowedSize = file.size < MAX_SIZE;
        if (!isAllowedSize) {
            MessageManager.showMessage("error",
                t("claimForm:fileSizeError", { size: `${ALLOWED_MB}MB` })
            );
        }
        return isAllowedFormat && isAllowedSize;
    };

    const handleChange: UploadProps["onChange"] = async ({
        file,
        fileList,
    }: UploadChangeParam<UploadFile>) => {
        if (file.originFileObj && validateBeforeUpload(file.originFileObj)) {
            setFileList(fileList);
            onChange(fileList);
        } else setFileList([]);
    };

    const uploadButton = (
        <AletheiaButton data-cy="testUploadImage" icon={<FileUploadOutlined style={{fontSize:"17px", margin:"0 5 4 0"}} />}>
            {t("claimForm:fileInputButton")}
        </AletheiaButton>
    );

    return (
        <Grid item xs={12}>
            <Upload
                listType="picture"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={validateBeforeUpload}
                defaultFileList={defaultFileList || []}
            >
                {fileList.length >= UPLOAD_LIMIT ? null : uploadButton}
            </Upload>
            {error && (
                <Typography variant="body2" color="error" style={{ display: "block" }}>
                    {t("common:requiredFieldError")}
                </Typography>
            )}
            <AletheiaModal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
                width={"fit-content"}
            >
                <img
                    alt={`preview uploaded file ${previewTitle}`}
                    width="auto"
                    style={{ maxWidth: "100%", maxHeight: "400px" }}
                    src={previewImage}
                />
            </AletheiaModal>
        </Grid>
    );
};

export default ImageUpload;
