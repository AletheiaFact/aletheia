import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { atomUserList } from "../../../atoms/userEdit";
import { Autocomplete, Avatar, Box, Grid, TextField } from "@mui/material";
import { useTranslation } from "next-i18next";
import { Roles } from "../../../types/enums";
import Label from "../../Label";
import userApi from "../../../api/userApi";
import { finishEditingItem } from "../../../atoms/editDrawer";
import { atomBadgesList } from "../../../atoms/badges";
import { Badge } from "../../../types/Badge";
import AletheiaButton from "../../AletheiaButton";
import { currentUserId } from "../../../atoms/currentUser";
import { canEdit } from "../../../utils/GetUserPermission";
import UserEditRoles from "./UserEditRoles";
import { NameSpace, NameSpaceEnum } from "../../../types/Namespace";
import NameSpacesApi from "../../../api/namespace";
import { currentNameSpace } from "../../../atoms/namespace";

const UserEditForm = ({ currentUser, setIsLoading }) => {
    const { t } = useTranslation();
    const [, finishEditing] = useAtom(finishEditingItem);
    const [badges, setBadges] = useState([]);
    const [role, setUserRole] = useState(currentUser?.role || Roles.Regular);
    const [badgesList] = useAtom(atomBadgesList);
    const [userId] = useAtom(currentUserId);
    const [options, setOptions] = useState<NameSpace[]>([]);
    const [selectedNamespaces, setSelectedNamespaces] = useState<NameSpace[]>([]);
    const [nameSpace] = useAtom(currentNameSpace);

    const handleChangeBadges = (_event, newValue: Badge[]) => {
        setBadges(newValue);
    };

    const handleChangeNameSpaces = (_event, newValue: NameSpace[]) => {
        setSelectedNamespaces(newValue);
    };
    useEffect(() => {
        const fetchNamespaces = async () => {
            try {
                const namespaces = await NameSpacesApi.getAllNameSpaces();
                setOptions(namespaces);

                const userNamespaceKeys = Object.keys(currentUser?.role ?? {});
                const selected = namespaces.filter((ns) =>
                    userNamespaceKeys.includes(ns.slug)
                );
                setSelectedNamespaces(selected);
            } catch (err) {
                console.error(err);
            }
        };
        fetchNamespaces();
    }, [setOptions, currentUser?.role]);

    useEffect(() => {
        // this was necessery because the select was not recognizing the
        // badges in currentUser.badges as selected items
        const badgeIds = currentUser?.badges?.map((obj) => obj._id);
        setUserRole(currentUser?.role || { main: Roles.Regular });

        setBadges(
            badgeIds?.length
                ? badgesList.filter((badge) => badgeIds?.includes(badge._id))
                : []
        );
    }, [badgesList, currentUser?.badges, currentUser?.role]);

    const shouldEdit = canEdit(currentUser, userId);

    const handleClickSave = async () => {
        try {
            setIsLoading(true);
            const sendBadges = badges.map((badge) => badge._id);
            const selectedSlugs = selectedNamespaces.map(ns => ns.slug);
            const updatedRole = { ...role };
            const currentNamespacesUser = await NameSpacesApi.getNameSpacesById(currentUser._id);
            const currentIds = currentNamespacesUser.map(ns => ns._id);
            const selectedIds = selectedNamespaces.map(ns => ns._id);

            Object.keys(updatedRole).forEach((role) => {
                if (role !== NameSpaceEnum.Main && !selectedSlugs.includes(role)) {
                    delete updatedRole[role];
                }
            });

            selectedSlugs.forEach((slug) => {
                updatedRole[slug] ??= Roles.Regular;
            });

            for (const namespace of selectedNamespaces) {
                const userAlreadyExist = namespace.users.some(user => user._id === currentUser._id);

                const updatedNamespaces = {
                    _id: namespace._id,
                    users: userAlreadyExist
                        ? namespace.users
                        : [...namespace.users, currentUser],
                };

                if (!currentIds.includes(namespace._id)) {
                    await NameSpacesApi.updateNameSpace(updatedNamespaces, t);
                }
            }

            for (const namespace of currentNamespacesUser) {
                if (!selectedIds.includes(namespace._id)) {
                    const updatedUser = namespace.users
                        .filter(user => String(user._id || user) !== String(currentUser._id))
                        .map(user => (typeof user === 'string' ? { _id: user } : user));

                    const updatedNamespaces = {
                        _id: namespace._id,
                        users: updatedUser,
                    };
                    await NameSpacesApi.updateNameSpace(updatedNamespaces, t);
                }
            }

            await userApi.update(
                currentUser?._id,
                { role: updatedRole, badges: sendBadges },
                t
            );

            finishEditing({
                newItem: { ...currentUser, role: updatedRole, badges },
                listAtom: atomUserList,
                closeDrawer: true,
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Grid item xs={10} mt={2}>
                <UserEditRoles
                    currentUser={currentUser}
                    role={role}
                    setUserRole={setUserRole}
                    shouldEdit={shouldEdit}
                />
            </Grid>
            {nameSpace === NameSpaceEnum.Main ?
                <Grid item xs={10} mt={2}>
                    <Label>{t("header:nameSpaceItem")}</Label>
                    <Autocomplete
                        disabled={!shouldEdit}
                        multiple
                        id="namespaces"
                        options={options}
                        getOptionLabel={(option) => option.name}
                        value={selectedNamespaces}
                        onChange={handleChangeNameSpaces}
                        disableCloseOnSelect
                        renderInput={(params) => (
                            <TextField {...params}
                                placeholder={t("namespaces:selectNameSpaces")}
                            />
                        )}
                        renderOption={(props, option) => (
                            <Box component={"li"} {...props}>
                                {option.name}
                            </Box>
                        )}
                    />
                </Grid>
                : null
            }
            <Grid item xs={10} mt={2}>
                <Label>{t("header:badgesItem")}</Label>
                <Autocomplete
                    disabled={!shouldEdit}
                    multiple
                    id="badges"
                    options={badgesList}
                    getOptionLabel={(option) => option.name}
                    value={badges}
                    onChange={handleChangeBadges}
                    defaultValue={currentUser?.badges}
                    disableCloseOnSelect
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder={t("badges:selectBadges")}
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box component={"li"} {...props}>
                            <Avatar
                                src={option.image.content}
                                sx={{ mr: 1 }}
                                sizes="small"
                            />
                            {option.name}
                        </Box>
                    )}
                />
            </Grid>
            <Grid item xs={10} mt={5}>
                {shouldEdit && (
                    <AletheiaButton onClick={handleClickSave}>
                        {t("admin:saveButtonLabel")}
                    </AletheiaButton>
                )}
            </Grid>
        </>
    );
};

export default UserEditForm;
