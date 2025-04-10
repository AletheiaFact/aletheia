import React, { useRef, useState } from "react";
import {
    Grid,
    Box,
    Typography,
    Dialog,
    DialogTitle,
    IconButton,
} from "@mui/material";
import { FileUploadOutlined, DeleteOutline } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import AletheiaButton from "./Button";
import { MessageManager } from "../components/Messages";

export interface UploadFile {
    uid: string;
    name: string;
    status?: string;
    url?: string;
    originFileObj?: File;
    preview?: string;
}

interface ImageUploadProps {
    onChange: (fileList: UploadFile[]) => void;
    error?: boolean;
    defaultFileList?: UploadFile[];
}

const ImageUpload = ({
    onChange,
    error = false,
    defaultFileList = [],
}: ImageUploadProps) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");

    const UPLOAD_LIMIT = 1;
    const ALLOWED_FORMATS = ["image"];
    const ONE_MB = 1048576;
    const ALLOWED_MB = 10;
    const MAX_SIZE = ALLOWED_MB * ONE_MB;

    const getBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
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
                t("claimForm:fileSizeError", {
                    size: `${ALLOWED_MB}MB`,
                })
            );
        }
        return isAllowedFormat && isAllowedSize;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const rawFile = e.target.files[0];
        if (!validateBeforeUpload(rawFile)) {
            e.target.value = "";
            return;
        }
        const preview = await getBase64(rawFile);
        const newItem: UploadFile = {
            uid: `${rawFile.name}-${Date.now()}`,
            name: rawFile.name,
            originFileObj: rawFile,
            status: "done",
            preview,
        };
        const newFileList = [newItem];
        setFileList(newFileList);
        onChange(newFileList);
        e.target.value = "";
    };

    const handleRemove = (file: UploadFile) => {
        const updatedList = fileList.filter((f) => f.uid !== file.uid);
        setFileList(updatedList);
        onChange(updatedList);
    };

    const handleOpenPreview = (file: UploadFile) => {
        if (file.preview) {
            setPreviewImage(file.preview);
        } else if (file.url) {
            setPreviewImage(file.url);
        }
        setPreviewTitle(file.name);
        setPreviewOpen(true);
    };

    const handleClosePreview = () => {
        setPreviewOpen(false);
    };

    const uploadButton = (
        <AletheiaButton
            startIcon={
                <FileUploadOutlined style={{ fontSize: 17, marginRight: 5 }} />
            }
            onClick={() => fileInputRef.current?.click()}
        >
            {t("claimForm:fileInputButton")}
        </AletheiaButton>
    );

    return (
        <Grid item xs={12}>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
                {fileList.map((file) => {
                    const imageSrc = file.preview || file.url;
                    return (
                        <Box
                            key={file.uid}
                            display="flex"
                            alignItems="center"
                            sx={{ mt: 1 }}
                        >
                            {imageSrc && (
                                <Box
                                    sx={{ cursor: "pointer", mr: 1 }}
                                    onClick={() => handleOpenPreview(file)}
                                >
                                    <img
                                        src={imageSrc}
                                        alt={file.name}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            objectFit: "cover",
                                            borderRadius: 8,
                                        }}
                                    />
                                </Box>
                            )}
                            <Typography
                                variant="body2"
                                sx={{ cursor: "pointer", mr: 1 }}
                                onClick={() => handleOpenPreview(file)}
                            >
                                {file.name}
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={() => handleRemove(file)}
                            >
                                <DeleteOutline />
                            </IconButton>
                        </Box>
                    );
                })}
                {fileList.length < UPLOAD_LIMIT && uploadButton}
                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: "none" }}
                    accept="image/*"
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
                    {previewImage && (
                        <img
                            alt={`preview of ${previewTitle}`}
                            style={{ maxWidth: "100%", maxHeight: "80vh" }}
                            src={previewImage}
                        />
                    )}
                </Box>
            </Dialog>
        </Grid>
    );
};

export default ImageUpload;
