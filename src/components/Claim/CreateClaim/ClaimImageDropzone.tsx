import React, { useRef, useState } from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import { FileUploadOutlined } from "@mui/icons-material";
import { useTranslation } from "next-i18next";

import colors from "../../../styles/colors";
import { MessageManager } from "../../Messages";
import { UploadFile } from "../../ImageUpload";

const ALLOWED_TYPES = ["image/png", "image/jpeg"];
const ALLOWED_MB = 10;
const MAX_SIZE = ALLOWED_MB * 1048576;

interface ClaimImageDropzoneProps {
    onChange: (fileList: UploadFile[]) => void;
    error?: boolean;
}

const ClaimImageDropzone = ({ onChange, error = false }: ClaimImageDropzoneProps) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<UploadFile | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const isValid = (rawFile: File) => {
        if (!ALLOWED_TYPES.includes(rawFile.type)) {
            MessageManager.showMessage(
                "error",
                t("claimForm:fileTypeError", { types: "PNG/JPG" })
            );
            return false;
        }
        if (rawFile.size >= MAX_SIZE) {
            MessageManager.showMessage(
                "error",
                t("claimForm:fileSizeError", { size: `${ALLOWED_MB}MB` })
            );
            return false;
        }
        return true;
    };

    const selectFile = (rawFile?: File) => {
        if (!rawFile || !isValid(rawFile)) return;
        const reader = new FileReader();
        reader.onload = () => {
            const newFile: UploadFile = {
                uid: `${rawFile.name}-${Date.now()}`,
                name: rawFile.name,
                originFileObj: rawFile,
                status: "done",
                preview: reader.result as string,
            };
            setFile(newFile);
            onChange([newFile]);
        };
        reader.readAsDataURL(rawFile);
    };

    const removeFile = () => {
        setFile(null);
        onChange([]);
    };

    const openFilePicker = () => fileInputRef.current?.click();

    let borderColor = colors.neutralSecondary;
    if (error) {
        borderColor = colors.error;
    } else if (isDragging) {
        borderColor = colors.primary;
    }

    return (
        <Box sx={{ width: "100%" }}>
            <Box
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    selectFile(e.dataTransfer.files?.[0]);
                }}
                sx={{
                    width: "100%",
                    minHeight: 200,
                    border: `1px dashed ${borderColor}`,
                    borderRadius: "8px",
                    backgroundColor: colors.lightNeutral,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                }}
            >
                {file ? (
                    <>
                        <img
                            src={file.preview}
                            alt={file.name}
                            style={{
                                maxWidth: "100%",
                                maxHeight: 320,
                                objectFit: "contain",
                                borderRadius: 4,
                            }}
                        />
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "8px",
                                marginTop: "12px",
                                fontSize: 14,
                                color: colors.blackSecondary,
                            }}
                        >
                            <span style={{ wordBreak: "break-all" }}>{file.name}</span>
                            <span aria-hidden="true">·</span>
                            <ButtonBase
                                onClick={openFilePicker}
                                sx={{ fontSize: 14, textDecoration: "underline" }}
                            >
                                {t("claimForm:createForm.Image.replaceImage")}
                            </ButtonBase>
                            <span aria-hidden="true">·</span>
                            <ButtonBase
                                onClick={removeFile}
                                sx={{
                                    fontSize: 14,
                                    textDecoration: "underline",
                                    color: colors.error,
                                }}
                            >
                                {t("claimForm:createForm.Image.removeImage")}
                            </ButtonBase>
                        </Box>
                    </>
                ) : (
                    <ButtonBase
                        onClick={openFilePicker}
                        data-cy="testUploadImage"
                        sx={{
                            width: "100%",
                            minHeight: 168,
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            borderRadius: "8px",
                        }}
                    >
                        <FileUploadOutlined
                            aria-hidden="true"
                            sx={{ fontSize: 28, color: colors.secondary }}
                        />
                        <Typography
                            sx={{ fontSize: 14, fontWeight: 600, color: colors.primary }}
                        >
                            {t("claimForm:fileInputButton")}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: colors.neutralSecondary }}>
                            {t("claimForm:createForm.Image.fileHint")}
                        </Typography>
                    </ButtonBase>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: "none" }}
                    accept={ALLOWED_TYPES.join(",")}
                    onChange={(e) => {
                        selectFile(e.target.files?.[0]);
                        e.target.value = "";
                    }}
                />
            </Box>
            {error && (
                <Typography variant="body2" color="error" mt={1}>
                    {t("common:requiredFieldError")}
                </Typography>
            )}
        </Box>
    );
};

export default ClaimImageDropzone;
