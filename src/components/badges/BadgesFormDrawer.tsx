import { Divider, Grid } from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
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
import colors from "../../styles/colors";
import LargeDrawer from "../LargeDrawer";
import DynamicBadgesForm from "./DynamicBadgesForm";
import { IBadgeData, IBadgeProps } from "../../types/Badge";

const BadgesFormDrawer = () => {
    const { t } = useTranslation();
    const [badgeEdited] = useAtom(badgeBeeingEdited);
    const [userList] = useAtom(atomUserList);

    const updatedBadges = {
        ...badgeEdited,
        usersId: badgeEdited?.users?.map(badges => badges._id) || [],
        imageField: badgeEdited?.image?.content ? [{
            uid: badgeEdited.image._id,
            name: badgeEdited.name || "Existing Badge Image",
            status: "done",
            url: badgeEdited.image.content,
        }] : []
    }
    const [open, setOpen] = useAtom(isEditDrawerOpen);
    const addBadge = useSetAtom(addBadgeToList);
    const finishEditing = useSetAtom(finishEditingItem);
    const cancelEditing = useSetAtom(cancelEditingItem);

    const isEdit = !!badgeEdited;
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: IBadgeData) => {
        const { name, description, imageField, usersId } = data;

        const usersAsObjects = userList.filter(user =>
            usersId?.includes(user._id)
        );

        setIsLoading(true);

        const newFiles = imageField
            .filter((f) => f.originFileObj)
            .map((f) => f.originFileObj);

        if (newFiles.length > 0) {
            const formData = new FormData();
            newFiles.forEach((file) => {
                formData.append("files", file);
            });
            try {
                const imagesUploaded = await ImageApi.uploadImage(formData, t);
                const newImage = imagesUploaded[0];
                handleBadgeSave({ name, description, image: newImage, users: usersAsObjects });
            } catch (err) {
                setIsLoading(false);
                console.error("Error uploading images:", err);
            }
        } else {
            handleBadgeSave({ name, description, image: badgeEdited?.image, users: usersAsObjects });
        }
    };

    const handleBadgeSave = (props: IBadgeProps) => {
        const { name, description, image, users } = props;
        if (isEdit && badgeEdited) {
            const newItem = { _id: badgeEdited._id, name, description, image };
            BadgesApi.updateBadge(newItem, users, t).then(() => {
                finishEditing({
                    newItem: { ...newItem, users },
                    listAtom: atomBadgesList,
                    closeDrawer: true,
                });
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
                    setOpen(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
    };

    const onCloseDrawer = () => {
        setOpen(false);
        cancelEditing();
    };

    return (
        <LargeDrawer
            open={open}
            onClose={onCloseDrawer}
            backgroundColor={colors.lightNeutralSecondary}
        >
            <Grid container justifyContent="center">
                <Grid item xs={10}>
                    <h2>
                        {t(isEdit ? "badges:editBadge" : "badges:addBadge")}
                    </h2>
                    <Divider />
                </Grid>

                <DynamicBadgesForm
                    badges={updatedBadges}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    isDrawerOpen={open}
                    onClose={onCloseDrawer}
                />
            </Grid>
        </LargeDrawer>
    );
};

export default BadgesFormDrawer;
