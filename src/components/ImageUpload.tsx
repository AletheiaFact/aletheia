import React from "react";
import ImageApi from "../api/image";

const ImageUpload = () => {
    const handleChange = async (e) => {
        const newFileList = e.target.files.length > 0 ? e.target.files : [];
        const formData = new FormData();

        for (const file of newFileList) {
            await formData.append("files", file);
        }

        ImageApi.uploadImage(formData);
    };

    return (
        <input
            type="file"
            name="myfile"
            multiple
            onChange={(e) => {
                handleChange(e);
            }}
        />
    );
};

export default ImageUpload;
