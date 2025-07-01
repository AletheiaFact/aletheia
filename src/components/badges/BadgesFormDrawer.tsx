import {
    Autocomplete,
    Divider,
    Grid,
    TextField,
    Typography,
} from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
import { atomUserList } from "../../atoms/userEdit";
import { currentUserId } from "../../atoms/currentUser";
import { canEdit } from "../../utils/GetUserPermission";
import { User } from "../../types/User";
import colors from "../../styles/colors";
import AletheiaInput from "../AletheiaInput";
import Button from "../Button";
import ImageUpload, { UploadFile } from "../ImageUpload";
import Label from "../Label";
import LargeDrawer from "../LargeDrawer";

const BadgesFormDrawer = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useAtom(isEditDrawerOpen);
    const [badgeEdited] = useAtom(badgeBeeingEdited);
    const addBadge = useSetAtom(addBadgeToList);
    const finishEditing = useSetAtom(finishEditingItem);
    const cancelEditing = useSetAtom(cancelEditingItem);
    const [userList] = useAtom(atomUserList);
    const [userId] = useAtom(currentUserId);

    const userListFiltered = userList.filter((u) => canEdit(u, userId));
    const isEdit = !!badgeEdited;

    let initialFileList: UploadFile[] = [];
    if (badgeEdited?.image) {
        initialFileList = [
            {
                uid: badgeEdited.image._id,
                name: badgeEdited.name || "Existing Badge Image",
                status: "done",
                url: badgeEdited.image.content,
            },
        ];
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<{
        name: string;
        description: string;
        image: UploadFile[];
        users: string[];
    }>({
        defaultValues: {
            name: badgeEdited?.name || "",
            description: badgeEdited?.description || "",
            image: initialFileList,
            users: badgeEdited?.users?.map((u) => u._id) || [],
        },
    });

    const [users, setUsers] = useState<User[]>([]);
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (badgeEdited) {
            const userIds = badgeEdited.users?.map((u) => u._id) || [];
            const found = userListFiltered.filter((u) =>
                userIds.includes(u._id)
            );
            setUsers(found);

            reset({
                name: badgeEdited.name,
                description: badgeEdited.description,
                image: initialFileList,
                users: userIds,
            });
        }
    }, [badgeEdited]);

    const onCloseDrawer = () => {
        resetForm();
        cancelEditing();
    };

    const resetForm = () => {
        reset({
            name: "",
            description: "",
            image: [],
            users: [],
        });
        setUsers([]);
        setImageError(false);
        setIsLoading(false);
    };

    const onSubmit = async (data: {
        name: string;
        description: string;
        image: UploadFile[];
        users: string[];
    }) => {
        const { name, description, image } = data;
        if (image.length === 0 && !badgeEdited?.image) {
            setImageError(true);
            return;
        }
        setIsLoading(true);

        const newFiles = image
            .filter((f) => f.originFileObj)
            .map((f) => f.originFileObj);

        if (newFiles.length > 0) {
            const formData = new FormData();
            newFiles.forEach((file) => {
                formData.append("files", file);
            });
            try {
                const imagesUploaded = await ImageApi.uploadImage(formData, t);
                setImageError(false);
                const newImage = imagesUploaded[0];
                handleBadgeSave({ name, description, image: newImage });
            } catch (err) {
                setIsLoading(false);
                console.error("Error uploading images:", err);
            }
        } else {
            handleBadgeSave({ name, description, image: badgeEdited?.image });
        }
    };

    const handleBadgeSave = (props: {
        name: string;
        description: string;
        image: any;
    }) => {
        const { name, description, image } = props;
        if (isEdit && badgeEdited) {
            const newItem = { _id: badgeEdited._id, name, description, image };
            BadgesApi.updateBadge(newItem, users, t).then(() => {
                finishEditing({
                    newItem: { ...newItem, users },
                    listAtom: atomBadgesList,
                    closeDrawer: true,
                });
                resetForm();
            });
        } else {
            const newBadge = {
                created_at: new Date().toISOString(),
                name,
                description,
                image,
            };
            BadgesApi.createBadge(newBadge, users, t)
                .then((createdBadge) => {
                    addBadge(createdBadge);
                    resetForm();
                    setOpen(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
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
                                data-cy="testBadgeName"
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
                                data-cy="testBadgeDescription"
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
                                rules={{ required: false }}
                                render={({ field }) => (
                                    <ImageUpload
                                        onChange={(
                                            uploadFiles: UploadFile[]
                                        ) => {
                                            field.onChange(uploadFiles);
                                            if (uploadFiles.length > 0) {
                                                setImageError(false);
                                            }
                                        }}
                                        error={!!errors.image || imageError}
                                        defaultFileList={field.value}
                                    />
                                )}
                            />
                            {imageError && (
                                <Typography variant="caption" color="error">
                                    {t("common:requiredFieldError")}
                                </Typography>
                            )}
                        </Grid>

                        <Grid item mb={2}>
                            <Autocomplete
                                multiple
                                options={userListFiltered}
                                getOptionLabel={(option: User) => option.name}
                                disableCloseOnSelect
                                limitTags={3}
                                value={users}
                                onChange={(_e, newValue) => setUsers(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Users"
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
