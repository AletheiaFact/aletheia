import { Divider, Grid, Typography } from "@mui/material";
import { Form } from "antd";
import { UploadFile } from "antd/lib/upload/interface";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";

import BadgesApi from "../../api/badgesApi";
import ImageApi from "../../api/image";
import {
    addBadgeToList,
    badgeBeeingEdited,
    badgesList,
} from "../../atoms/badges";
import { finishEditingItem, isEditDrawerOpen } from "../../atoms/editDrawer";
import colors from "../../styles/colors";
import AletheiaInput from "../AletheiaInput";
import Button from "../Button";
import ImageUpload from "../ImageUpload";
import Label from "../Label";
import LargeDrawer from "../LargeDrawer";
import { Controller, useForm } from "react-hook-form";

const BadgesFormDrawer = () => {
    const [badgeEdited] = useAtom(badgeBeeingEdited);
    const initialFileList: UploadFile[] = badgeEdited
        ? [
              {
                  uid: badgeEdited?.image._id,
                  name: badgeEdited?.name,
                  status: "done",
                  url: badgeEdited?.image.content,
              },
          ]
        : [];
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm({
        defaultValues: {
            name: badgeEdited?.name,
            description: badgeEdited?.description,
            image: initialFileList,
        },
    });

    const { t } = useTranslation();
    const [visible, setVisible] = useAtom(isEditDrawerOpen);
    const [, addBadge] = useAtom(addBadgeToList);
    const [, finishEditing] = useAtom(finishEditingItem);

    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (badgeEdited) {
            reset({
                name: badgeEdited?.name,
                description: badgeEdited?.description,
                image: initialFileList,
            });
        }
    }, [badgeEdited]);

    const resetForm = () => {
        reset();
        setImageError(false);
        setIsLoading(false);
    };

    const onSubmit = (data) => {
        console.log(data);
        resetForm();
        finishEditing({
            newItem: { ...badgeEdited, ...data },
            listAtom: badgesList,
        });
        const formData = new FormData();
        const fileList = data.image;
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
                        ...data,
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid item mb={2}>
                            <Label required>{t("badges:nameColumn")}</Label>
                            <AletheiaInput
                                {...register("name", { required: true })}
                                data-cy={"testBadgeName"}
                            />
                            {errors.name && (
                                <Typography variant="caption" color="error">
                                    {t("common:requiredFieldError")}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item mb={2}>
                            <Label required>
                                {t("badges:descriptionColumn")}
                            </Label>
                            <AletheiaInput
                                {...register("description", { required: true })}
                                data-cy={"testBadgeDescription"}
                            />
                            {errors.description && (
                                <Typography variant="caption" color="error">
                                    {t("common:requiredFieldError")}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item mb={2}>
                            <Label required>{t("badges:imageColumn")}</Label>
                            <Controller
                                name="image"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <ImageUpload
                                        onChange={() => {}}
                                        error={!!errors.image || imageError}
                                        defaultFileList={initialFileList}
                                        {...field}
                                    />
                                )}
                            />
                        </Grid>
                        <Button
                            style={{ marginTop: 24 }}
                            loading={isLoading}
                            htmlType="submit"
                        >
                            {t("admin:saveButtonLabel")}
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </LargeDrawer>
    );
};

export default BadgesFormDrawer;
