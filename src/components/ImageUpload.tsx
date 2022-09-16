import React, { useState } from "react";
import { Button, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ImageApi from "../api/image";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);

        reader.onerror = (error) => reject(error);
    });

const ImageUpload = () => {
    const [fileList, setFileList] = useState<object[]>();

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
    };

    const handleChange = ({ fileList: newFileList }) => {
        console.log("newFileList", newFileList);
        setFileList(newFileList);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );
    return (
        <>
            <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList ? null : uploadButton}
            </Upload>
            <Button
                onClick={() => {
                    console.log("fileList", fileList);
                    ImageApi.uploadImage(fileList[0]);
                }}
            >
                Upload image
            </Button>
        </>
    );
};

export default ImageUpload;
