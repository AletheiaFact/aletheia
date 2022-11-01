import { Col, Form, Row } from "antd";
import Text from "antd/lib/typography/Text";
import { UploadFile } from "antd/lib/upload/interface";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

import ImageApi from "../../../api/image";
import { CreateClaimMachineContext } from "../../../Context/CreateClaimMachineProvider";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import colors from "../../../styles/colors";
import AletheiaInput from "../../AletheiaInput";
import AletheiaButton from "../../Button";
import ImageUpload from "../../ImageUpload";
import Label from "../../Label";

const ClaimUploadImage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const formData = new FormData();

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [isLoading, setIsloading] = useState(false);
    const [imageError, setImageError] = useState(false);
    //TODO: Add recaptcha validation

    const { machineService } = useContext(CreateClaimMachineContext);

    const handleSubmit = ({ title }) => {
        if (fileList.length > 0) {
            setIsloading(true);

            fileList.forEach((file) => {
                formData.append("files", file.originFileObj);
            });

            ImageApi.uploadImage(formData)
                .then((imagesUploaded) => {
                    setImageError(false);

                    const claimData = {
                        title,
                        content: imagesUploaded[0],
                    };

                    machineService.send(CreateClaimEvents.persist, {
                        claimData,
                        t,
                        router,
                    });
                })
                .catch(() => {
                    setIsloading(false);
                });
        } else {
            setImageError(true);
        }
    };
    const handleAntdChange = (newFileList) => {
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
                    }}
                >
                    {t("claimForm:image")}
                </h3>
                <p
                    style={{
                        fontSize: "14px",
                        lineHeight: "20px",
                        color: colors.blackSecondary,
                        marginBottom: "8px",
                    }}
                >
                    {t("claimForm:uploadImageText")}
                </p>
            </div>
            <Form onFinish={handleSubmit}>
                <Label required>{t("claimForm:titleField")}</Label>
                <Form.Item
                    name="title"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: t("common:requiredFieldError"),
                        },
                    ]}
                    wrapperCol={{ sm: 24 }}
                    style={{ marginTop: "24px" }}
                >
                    <AletheiaInput
                        style={{ width: "100%" }}
                        placeholder={t("claimForm:titleFieldPlaceholder")}
                        data-cy={"testTitleClaimForm"}
                    />
                </Form.Item>
                <Row style={{ marginTop: "24px" }}>
                    <Label required>{t("claimForm:fileInputButton")}</Label>
                    <ImageUpload onChange={handleAntdChange} />
                    {imageError && (
                        <Text type="danger" style={{ display: "block" }}>
                            {t("common:requiredFieldError")}
                        </Text>
                    )}
                </Row>

                <Col
                    span={24}
                    style={{
                        margin: "24px 0",
                        display: "flex",
                        justifyContent: "space-evenly",
                    }}
                >
                    <AletheiaButton
                        style={{ textTransform: "uppercase" }}
                        htmlType="submit"
                        loading={isLoading}
                    >
                        {t("claimForm:uploadImageButton")}
                    </AletheiaButton>
                </Col>
            </Form>
        </>
    );
};

export default ClaimUploadImage;
