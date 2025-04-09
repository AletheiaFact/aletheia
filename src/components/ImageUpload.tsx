/* eslint-disable @next/next/no-img-element */
import { FileUploadOutlined } from "@mui/icons-material";
import { Box, Dialog, DialogTitle, Grid, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { useRef, useState } from "react";

import { MessageManager } from "../components/Messages";
import AletheiaButton from "./Button";

interface LocalUploadFile {
    uid: string;
    name: string;
    preview?: string;
    file: File;
}

interface ImageUploadProps {
    onChange: (files: File[]) => void;
    error?: boolean;
    defaultFileList?: File[];
}

const ImageUpload = ({
    onChange,
    error = false,
    defaultFileList = [],
}: ImageUploadProps) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const UPLOAD_LIMIT = 1;
    const ONE_MB = 1048576;
    const ALLOWED_MB = 10;
    const MAX_SIZE = ALLOWED_MB * ONE_MB;
    const ALLOWED_FORMATS = ["image"];

    const [fileList, setFileList] = useState<LocalUploadFile[]>(() => {
        return defaultFileList.map((file) => ({
            uid: `${file.name}-${Date.now()}`,
            name: file.name,
            file,
            preview: URL.createObjectURL(file),
        }));
    });

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    const getBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const validateBeforeUpload = (file: File) => {
        const isAllowedFormat = ALLOWED_FORMATS.includes(
            file.type.split("/")[0]
        );
        if (!isAllowedFormat) {
            MessageManager.showMessage(
                "error",
                t("claimForm:fileTypeError", {
                    types: ALLOWED_FORMATS.join("/"),
                })
            );
        }

        const isAllowedSize = file.size < MAX_SIZE;
        if (!isAllowedSize) {
            MessageManager.showMessage(
                "error",
                t("claimForm:fileSizeError", { size: `${ALLOWED_MB}MB` })
            );
        }

        return isAllowedFormat && isAllowedSize;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles: LocalUploadFile[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (validateBeforeUpload(file)) {
                const preview = await getBase64(file);
                newFiles.push({
                    uid: `${file.name}-${Date.now()}`,
                    name: file.name,
                    file,
                    preview,
                });
            }
        }

        const updatedFileList = [...fileList, ...newFiles].slice(
            0,
            UPLOAD_LIMIT
        );
        setFileList(updatedFileList);

        const justFiles = updatedFileList.map((f) => f.file);
        onChange(justFiles);
    };

    const handleOpenPreview = (localFile: LocalUploadFile) => {
        if (localFile.preview) {
            setPreviewImage(localFile.preview);
            setPreviewTitle(localFile.name);
            setPreviewOpen(true);
        }
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
    };

    const uploadButton = (
        <AletheiaButton
            data-cy="testUploadImage"
            startIcon={
                <FileUploadOutlined
                    style={{ fontSize: "17px", margin: "0 5px 4px 0" }}
                />
            }
            onClick={() => fileInputRef.current?.click()}
        >
            {t("claimForm:fileInputButton")}
        </AletheiaButton>
    );

    return (
        <Grid item xs={12}>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
                {fileList.map((localFile) => (
                    <Box
                        key={localFile.uid}
                        display="flex"
                        alignItems="center"
                        sx={{ mt: 1, cursor: "pointer" }}
                        onClick={() => handleOpenPreview(localFile)}
                    >
                        {localFile.preview && (
                            <img
                                src={localFile.preview}
                                alt={localFile.name}
                                style={{
                                    width: 80,
                                    height: 80,
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    marginRight: 8,
                                }}
                            />
                        )}
                        <Typography variant="body2">
                            {localFile.name}
                        </Typography>
                    </Box>
                ))}

                {fileList.length < UPLOAD_LIMIT && uploadButton}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    multiple={false}
                    onChange={handleFileChange}
                />

                {error && (
                    <Typography variant="body2" color="error" mt={1}>
                        {t("common:requiredFieldError")}
                    </Typography>
                )}
            </Box>

            <Dialog
                open={previewOpen}
                onClose={handleClosePreview}
                maxWidth="md"
            >
                <DialogTitle
                    sx={{
                        textAlign: "center",
                        textTransform: "uppercase",
                        fontSize: 14,
                    }}
                >
                    {previewTitle}
                </DialogTitle>
                <Box p={2} display="flex" justifyContent="center">
                    <img
                        alt={`preview uploaded file ${previewTitle}`}
                        style={{ maxWidth: "100%", maxHeight: "80vh" }}
                        src={previewImage}
                    />
                </Box>
            </Dialog>
        </Grid>
    );
};

export default ImageUpload;
