import { Divider, Grid } from "@mui/material";
import { useAtom, useSetAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import {
    finishEditingItem,
    isEditDrawerOpen,
    cancelEditingItem,
} from "../../atoms/editDrawer";
import colors from "../../styles/colors";
import LargeDrawer from "../LargeDrawer";
import {
    nameSpaceBeeingEdited,
    addNameSpaceToList,
    atomNameSpacesList,
} from "../../atoms/namespace";
import NameSpacesApi from "../../api/namespace";
import DynamicNameSpaceForm from "./DynamicNameSpaceForm";
import { atomUserList } from "../../atoms/userEdit";

const NameSpacesFormDrawer = () => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(nameSpaceBeeingEdited);
    const [userList] = useAtom(atomUserList);

    const updatedNamespace = {
        ...nameSpace,
        usersId: nameSpace?.users?.map(namespace => namespace._id) || []
    }

    const [open, setOpen] = useAtom(isEditDrawerOpen);
    const addNameSpace = useSetAtom(addNameSpaceToList);
    const finishEditing = useSetAtom(finishEditingItem);
    const cancelEditing = useSetAtom(cancelEditingItem);

    const isEdit = !!nameSpace;
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);
        const usersAsObjects = userList.filter(user =>
            data.usersId?.includes(user._id)
        );

        const updatedData = {
            ...data,
            users: usersAsObjects
        };
        try {
            if (isEdit) {
                await handleEditNameSpace(updatedData);
            } else {
                await handleCreateNameSpace(updatedData);
            }
            setOpen(false);
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
            users: data.users,
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
            users: data.users,
        };

        const createdNameSpace = await NameSpacesApi.createNameSpace(values, t);
        addNameSpace({
            ...createdNameSpace,
            users: data.users,
        });
    }

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
                        {t(
                            isEdit
                                ? "namespaces:editNameSpace"
                                : "namespaces:addNameSpace"
                        )}
                    </h2>
                    <Divider />
                </Grid>
                <DynamicNameSpaceForm
                    nameSpace={updatedNamespace}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    t={t}
                />
            </Grid>
        </LargeDrawer>
    );
};

export default NameSpacesFormDrawer;
