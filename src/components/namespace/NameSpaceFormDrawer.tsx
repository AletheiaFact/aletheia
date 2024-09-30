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

import {
    finishEditingItem,
    isEditDrawerOpen,
    cancelEditingItem,
} from "../../atoms/editDrawer";
import colors from "../../styles/colors";
import AletheiaInput from "../AletheiaInput";
import Button from "../Button";
import Label from "../Label";
import LargeDrawer from "../LargeDrawer";
import { useForm } from "react-hook-form";
import { atomUserList } from "../../atoms/userEdit";
import { User } from "../../types/User";
import { currentUserId } from "../../atoms/currentUser";
import { canEdit } from "../../utils/GetUserPermission";
import {
    nameSpaceBeeingEdited,
    addNameSpaceToList,
    atomNameSpacesList,
} from "../../atoms/namespace";
import NameSpacesApi from "../../api/namespace";
import DailyReportApi from "../../api/dailyReport";

const NameSpacesFormDrawer = () => {
    const [nameSpace] = useAtom(nameSpaceBeeingEdited);
    const [userList] = useAtom(atomUserList);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            name: nameSpace?.name,
            users: nameSpace?.users?.map((user) => user?._id),
        },
    });

    const { t } = useTranslation();
    const [open, setOpen] = useAtom(isEditDrawerOpen);
    const addNameSpace = useSetAtom(addNameSpaceToList);
    const finishEditing = useSetAtom(finishEditingItem);
    const cancelEditing = useSetAtom(cancelEditingItem);
    const [userId] = useAtom(currentUserId);

    const isEdit = !!nameSpace;
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([]);

    const userListFiltered = userList.filter((user) => {
        return canEdit(user, userId);
    });
    useEffect(() => {
        const userIds = nameSpace?.users?.map((user) => user._id);
        if (nameSpace) {
            setUsers(
                nameSpace?.users?.length
                    ? userListFiltered.filter((user) =>
                          userIds.includes(user._id)
                      )
                    : []
            );

            reset({
                name: nameSpace?.name,
            });
        }
    }, [nameSpace]);

    const resetForm = () => {
        reset({
            name: "",
        });
        setUsers([]);
        setIsLoading(false);
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (isEdit) {
                await handleEditNameSpace(data);
            } else {
                await handleCreateNameSpace(data);
            }
            setOpen(false);
            resetForm();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDailyReviews = async () => {
        setIsLoading(true);
        try {
            await DailyReportApi.sendDailyReportEmail(
                nameSpace._id,
                nameSpace.slug,
                t
            );
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    async function handleEditNameSpace(data) {
        const newItem = {
            _id: nameSpace._id,
            name: data.name,
            users,
        };

        await NameSpacesApi.updateNameSpace(newItem, t);

        finishEditing({
            newItem: { ...newItem, slug: nameSpace.slug },
            listAtom: atomNameSpacesList,
            closeDrawer: true,
        });
    }

    async function handleCreateNameSpace(data) {
        const values = {
            name: data.name,
            users,
        };

        const createdNameSpace = await NameSpacesApi.createNameSpace(values, t);
        addNameSpace({
            ...createdNameSpace,
            users,
        });
    }

    const onCloseDrawer = () => {
        resetForm();
        cancelEditing();
    };

    return (
        <LargeDrawer
            open={open}
            onClose={onCloseDrawer}
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
                    <h2>
                        {t(
                            isEdit
                                ? "namespaces:editNameSpace"
                                : "namespaces:addNameSpace"
                        )}
                    </h2>
                    <Divider />
                </Grid>
                <Grid item xs={10} mt={2}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid item mb={2}>
                            <Label required>{t("namespaces:nameColumn")}</Label>
                            <AletheiaInput
                                {...register("name", { required: true })}
                                data-cy={"testNameSpaceName"}
                            />
                            {errors.name && (
                                <Typography variant="caption" color="error">
                                    {t("common:requiredFieldError")}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item mb={2}>
                            <Autocomplete
                                multiple
                                id="namespaces-users"
                                options={userListFiltered}
                                getOptionLabel={(option: User) => option.name}
                                getOptionKey={(option) => option._id}
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
                        <Grid container spacing={2} style={{ marginTop: 24 }}>
                            <Grid item>
                                <Button loading={isLoading} htmlType="submit">
                                    {t("admin:saveButtonLabel")}
                                </Button>
                            </Grid>
                            {nameSpace?._id && (
                                <Grid item>
                                    <Button
                                        onClick={handleDailyReviews}
                                        loading={isLoading}
                                        htmlType="button"
                                    >
                                        {t("notification:dailyReportButton")}
                                    </Button>
                                </Grid>
                            )}
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </LargeDrawer>
    );
};

export default NameSpacesFormDrawer;
