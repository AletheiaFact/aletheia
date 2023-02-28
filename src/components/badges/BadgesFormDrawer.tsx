import { Divider, Grid } from "@mui/material";
import { Form } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";

import BadgesApi from "../../api/badgesApi";
import ImageApi from "../../api/image";
import { addBadgeToList } from "../../atoms/badges";
import { isEditDrawerOpen } from "../../atoms/editDrawer";
import colors from "../../styles/colors";
import AletheiaInput from "../AletheiaInput";
import Button from "../Button";
import ImageUpload from "../ImageUpload";
import Label from "../Label";
import LargeDrawer from "../LargeDrawer";
import TextArea from "../TextArea";

const BadgesFormDrawer = () => {
    const { t } = useTranslation();
    const [visible, setVisible] = useAtom(isEditDrawerOpen);
    const [, addBadge] = useAtom(addBadgeToList);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setName("");
        setDescription("");
        setFileList([]);
        setImageError(false);
        setIsLoading(false);
    };

    const handleSubmit = () => {
        const formData = new FormData();
        if (fileList.length > 0) {
            setIsLoading(true);
            fileList.forEach((file) => {
                formData.append("files", file.originFileObj);
            });

            ImageApi.uploadImage(formData, t)
                .then((imagesUploaded) => {
                    setImageError(false);
                    console.log(imagesUploaded);
                    const values = {
                        name,
                        description,
                        created_at: new Date().toISOString(),
                        image: imagesUploaded[0],
                    };

                    BadgesApi.createBadge(values, t)
                        .then((createdBadge) => {
                            console.log(createdBadge);
                            addBadge(createdBadge);
                            resetForm();
                            setVisible(false);
                        })
                        .catch((err) => {
                            setIsLoading(false);
                        });
                })
                .catch((err) => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
            setImageError(true);
        }
    };

    const onChangeUpload = (newFileList) => {
        setFileList(newFileList);
    };

    return (
        <LargeDrawer
            visible={visible}
            onClose={() => {
                setVisible(false);
            }}
            backgroundColor={colors.lightGraySecondary}
        >
            <Grid
                container
                justifyContent="center"
                alignItems="stretch"
                spacing={1}
                mt={2}
            >
                <Grid item xs={10}>
                    <h2>{t("badges:addBadge")}</h2>
                    <Divider />
                </Grid>
                <Grid item xs={10} mt={2}>
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            name="name"
                            label={t("badges:nameColumn")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common:requiredFieldError"),
                                    whitespace: true,
                                },
                            ]}
                            wrapperCol={{ sm: 24 }}
                            style={{
                                width: "100%",
                            }}
                        >
                            <AletheiaInput
                                value={name || ""}
                                onChange={(e) => setName(e.target.value)}
                                data-cy={"testBadgeName"}
                            />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label={t("badges:descriptionColumn")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common:requiredFieldError"),
                                    whitespace: true,
                                },
                            ]}
                            wrapperCol={{ sm: 24 }}
                            style={{
                                width: "100%",
                            }}
                        >
                            <TextArea
                                value={description || ""}
                                onChange={(e) => setDescription(e.target.value)}
                                data-cy={"testBadgeDescription"}
                            />
                        </Form.Item>
                        <Label required>{t("badges:imageColumn")}</Label>
                        <ImageUpload
                            onChange={onChangeUpload}
                            error={imageError}
                        />
                        <Button
                            style={{ marginTop: 24 }}
                            loading={isLoading}
                            htmlType="submit"
                        >
                            {t("admin:saveButtonLabel")}
                        </Button>
                    </Form>
                </Grid>
            </Grid>
        </LargeDrawer>
    );
};

export default BadgesFormDrawer;
