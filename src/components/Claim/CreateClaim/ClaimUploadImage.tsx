import { Col, Form, Row } from "antd";
import Text from "antd/lib/typography/Text";
import { UploadFile } from "antd/lib/upload/interface";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

import ImageApi from "../../../api/image";
import { CreateClaimMachineContext } from "../../../Context/CreateClaimMachineProvider";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import colors from "../../../styles/colors";
import AletheiaInput from "../../AletheiaInput";
import AletheiaButton from "../../Button";
import DatePickerInput from "../../Form/DatePickerInput";
import ImageUpload from "../../ImageUpload";
import Label from "../../Label";
import SourceInput from "../../Source/SourceInput";

const ClaimUploadImage = () => {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const formData = new FormData();
    moment.locale(i18n.language);

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [sources, setSources] = useState([""]);
    const [isLoading, setIsloading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [date, setDate] = useState(moment());
    //TODO: Add recaptcha validation

    const { machineService } = useContext(CreateClaimMachineContext);
    const disabledDate = (current) => {
        return current && current > moment().endOf("day");
    };

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
                        date,
                        sources,
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
                >
                    <AletheiaInput
                        style={{ width: "100%" }}
                        placeholder={t("claimForm:titleFieldPlaceholder")}
                        data-cy={"testTitleClaimForm"}
                    />
                </Form.Item>
                <Label required>{t("claimForm:dateField")}</Label>
                <Form.Item
                    name="date"
                    rules={[
                        {
                            required: true,
                            message: t("claimForm:dateFieldError"),
                        },
                    ]}
                    extra={t("claimForm:dateFieldHelpImage")}
                    wrapperCol={{ sm: 24 }}
                    style={{
                        width: "100%",
                        marginBottom: "24px",
                    }}
                >
                    <DatePickerInput
                        placeholder={t("claimForm:dateFieldPlaceholder")}
                        onChange={(value) => setDate(value)}
                        data-cy={"dataAserSelecionada"}
                        disabledDate={disabledDate}
                    />
                </Form.Item>
                <Label required>{t("sourceForm:label")}</Label>
                <SourceInput
                    label={null}
                    name="source"
                    onChange={(e, index) => {
                        setSources(
                            sources.map((source, i) => {
                                return i === index ? e.target.value : source;
                            })
                        );
                    }}
                    addSource={() => {
                        setSources(sources.concat(""));
                    }}
                    removeSource={(index) => {
                        setSources(
                            sources.filter((_source, i) => {
                                return i !== index;
                            })
                        );
                    }}
                    placeholder={t("sourceForm:placeholder")}
                    sources={sources}
                />
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