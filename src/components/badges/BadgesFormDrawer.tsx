import {
    Autocomplete,
    Divider,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { UploadFile } from "antd/lib/upload/interface";
import { useAtom, useSetAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";

import BadgesApi from "../../api/badgesApi";
import ImageApi from "../../api/image";
import {
    addBadgeToList,
    badgeBeeingEdited,
    atomBadgesList,
} from "../../atoms/badges";
import {
    finishEditingItem,
    isEditDrawerOpen,
    cancelEditingItem,
} from "../../atoms/editDrawer";
import colors from "../../styles/colors";
import AletheiaInput from "../AletheiaInput";
import Button from "../Button";
import ImageUpload from "../ImageUpload";
import Label from "../Label";
import LargeDrawer from "../LargeDrawer";
import { Controller, useForm } from "react-hook-form";
import { atomUserList } from "../../atoms/userEdit";
import { User } from "../../types/User";
import { currentUserId } from "../../atoms/currentUser";
import { canEdit } from "../../utils/GetUserPermission";

const BadgesFormDrawer = () => {
    const [badgeEdited] = useAtom(badgeBeeingEdited);
    const [userList] = useAtom(atomUserList);
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
            users: badgeEdited?.users?.map((user) => user?._id),
        },
    });

    const { t } = useTranslation();
    const [open, setOpen] = useAtom(isEditDrawerOpen);
    const addBadge = useSetAtom(addBadgeToList);
    const finishEditing = useSetAtom(finishEditingItem);
    const cancelEditing = useSetAtom(cancelEditingItem);
    const [userId] = useAtom(currentUserId);

    const isEdit = !!badgeEdited;
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const userListFiltered = userList.filter((user) => {
        return canEdit(user, userId);
    });
    useEffect(() => {
        if (badgeEdited) {
            const userIds = badgeEdited?.users?.map((user) => user._id);
            setUsers(
                userIds?.length
                    ? userListFiltered.filter((user) =>
                          userIds.includes(user._id)
                      )
                    : []
            );

            reset({
                name: badgeEdited?.name,
                description: badgeEdited?.description,
                image: initialFileList,
            });
        }
    }, [badgeEdited]);

    const resetForm = () => {
        reset({
            name: "",
            description: "",
            image: [],
        });
        setUsers([]);
        setImageError(false);
        setIsLoading(false);
    };

    const onSubmit = (data) => {
        const { name, description } = data;

        const formData = new FormData();
        const fileList = data.image;
        if (fileList.length > 0) {
            setIsLoading(true);
            fileList.forEach((file) => {
                formData.append("files", file.originFileObj);
            });

            // TODO: make a single component to upload images
            ImageApi.uploadImage(formData, t)
                .then((imagesUploaded) => {
                    setImageError(false);
                    const image = imagesUploaded[0] || badgeEdited?.image;

                    if (isEdit) {
                        const newItem = {
                            _id: badgeEdited._id,
                            name,
                            description,
                            image,
                        };

                        BadgesApi.updateBadge(newItem, users, t).then(() => {
                            finishEditing({
                                newItem: { ...newItem, users },
                                listAtom: atomBadgesList,
                                closeDrawer: true,
                            });
                            resetForm();
                        });
                    } else {
                        const values = {
                            created_at: new Date().toISOString(),
                            name,
                            description,
                            image,
                        };
                        BadgesApi.createBadge(values, users, t)
                            .then((createdBadge) => {
                                addBadge(createdBadge);
                                resetForm();
                                setOpen(false);
                            })
                            .catch((err) => {
                                setIsLoading(false);
                            });
                    }
                })
                .catch((err) => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
            setImageError(true);
        }
    };

    const onCloseDrawer = () => {
        resetForm();
        cancelEditing();
    };

    return (
        <LargeDrawer
            open={open}
            onClose={onCloseDrawer}
            backgroundColor={colors.lightNeutralSecondary}
        >
            <Grid
                container
                justifyContent="center"
                alignItems="stretch"
                spacing={1}
                mt={2}
            >
                <Grid item xs={10}>
                    <h2>
                        {t(isEdit ? "badges:editBadge" : "badges:addBadge")}
                    </h2>
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
                        <Grid item mb={2}>
                            <Autocomplete
                                multiple
                                id="badge-users"
                                options={userListFiltered}
                                getOptionLabel={(option: User) => option.name}
                                disableCloseOnSelect
                                limitTags={3}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Users"
                                    />
                                )}
                                value={users}
                                onChange={(_event, newValue) => {
                                    setUsers(newValue);
                                }}
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
