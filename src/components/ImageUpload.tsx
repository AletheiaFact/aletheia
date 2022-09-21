import { LoadingOutlined } from "@ant-design/icons";
import { Col, Form } from "antd";
import React, { useState } from "react";
import ImageApi from "../api/image";
import ClaimApi from "../api/claim";
import AletheiaInput from "./AletheiaInput";
import AletheiaButton from "./Button";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const ImageUpload = ({ personality }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const formData = new FormData();

    const [imagePreview, setImagePreview] = useState(false);
    const [isLoading, setIsloading] = useState(false);
    const [imageUploadedUrl, setImageUploadedUrl] = useState(null);
    const [image, setImage] = useState([{}]); // add type

    const handleChange = async (e) => {
        const newFileList = e.target.files.length > 0 ? e.target.files : [];
        for (const file of newFileList) {
            await formData.append("files", file);
        }
        setImagePreview(true);
        setIsloading(true);

        ImageApi.uploadImage(formData).then((imageUploaded) => {
            setImage(imageUploaded);
            setIsloading(false);
            setImageUploadedUrl(
                imageUploaded[0]?.FileURL ? imageUploaded[0].FileURL : null
            );
        });
    };

    const handleSubmit = ({ title }) => {
        const imageBody = {
            title,
            ...image[0],
            contentModel: "Image",
            personality: personality._id || undefined,
        };

        return ClaimApi.saveImage(t, imageBody).then((claim) => {
            const path = claim?.personality
                ? `/personality/${personality.slug}/claim/${claim.slug}`
                : `/claim/${claim.slug}`;
            router.push(path);
        });
    };

    return (
        <Form onFinish={handleSubmit}>
            <Col style={{ marginTop: "24px" }}>
                <input
                    type="file"
                    name="myfile"
                    multiple
                    onChange={(e) => {
                        handleChange(e);
                    }}
                />

                {imagePreview && (
                    <>
                        {isLoading && (
                            <Col
                                style={{
                                    width: "100%",
                                    height: "150px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: "12px",
                                }}
                            >
                                <LoadingOutlined
                                    style={{ fontSize: 32 }}
                                    spin
                                />
                            </Col>
                        )}
                        {!isLoading && (
                            <Col style={{ marginTop: "12px" }}>
                                <img src={imageUploadedUrl} width="100%" />
                            </Col>
                        )}
                    </>
                )}
            </Col>

            <Form.Item
                name="title"
                label={"titulo da imagem"}
                rules={[
                    {
                        required: true,
                        whitespace: true,
                        message: "obrigatório",
                    },
                ]}
                wrapperCol={{ sm: 24 }}
                style={{ marginTop: "24px" }}
            >
                <AletheiaInput style={{ width: "100%" }} />
            </Form.Item>

            <Col
                span={24}
                style={{
                    margin: "24px 0",
                    display: "flex",
                    justifyContent: "right",
                }}
            >
                <AletheiaButton htmlType="submit">Upload Image</AletheiaButton>
            </Col>
        </Form>
    );
};

export default ImageUpload;
