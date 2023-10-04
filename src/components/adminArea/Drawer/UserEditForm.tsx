import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { atomUserList } from "../../../atoms/userEdit";
import {
    Autocomplete,
    Avatar,
    Box,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { Roles } from "../../../types/enums";
import Label from "../../Label";
import userApi from "../../../api/userApi";
import { finishEditingItem } from "../../../atoms/editDrawer";
import { atomBadgesList } from "../../../atoms/badges";
import { Badge } from "../../../types/Badge";
import Button from "../../Button";
import { currentUserId, currentUserRole } from "../../../atoms/currentUser";
import { canEdit } from "../../../utils/GetUserPermission";

const UserEditForm = ({ currentUser, setIsLoading }) => {
    const { t } = useTranslation();
    const [, finishEditing] = useAtom(finishEditingItem);
    const [badges, setBadges] = useState([]);
    const [role, setUserRole] = useState(currentUser?.role || Roles.Regular);
    const [badgesList] = useAtom(atomBadgesList);
    const [userRole] = useAtom(currentUserRole);
    const [userId] = useAtom(currentUserId);

    const handleChangeBadges = (_event, newValue: Badge[]) => {
        setBadges(newValue);
    };

    useEffect(() => {
        // this was necessery because the select was not recognizing the
        // badges in currentUser.badges as selected items
        const badgeIds = currentUser?.badges?.map((obj) => obj._id);
        setUserRole(currentUser?.role || Roles.Regular);

        setBadges(
            badgeIds?.length
                ? badgesList.filter((badge) => {
                      return badgeIds?.includes(badge._id);
                  })
                : []
        );
    }, [badgesList, currentUser?.badges, currentUser?.role]);

    const shouldEdit = canEdit(currentUser, userId);

    const handleClickSave = async () => {
        try {
            setIsLoading(true);
            const sendBadges = badges.map((badge) => badge._id);
            await userApi.update(
                currentUser?._id,
                { role, badges: sendBadges },
                t
            );

            finishEditing({
                newItem: { ...currentUser, role, badges },
                listAtom: atomUserList,
                closeDrawer: true,
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserRole(event.target.value as Roles);
    };
    return (
        <>
            <Grid item xs={10} mt={2}>
                <FormControl>
                    <Label>{t("admin:columnRole")}</Label>
                    <RadioGroup
                        row
                        name="roles"
                        value={role}
                        onChange={handleChangeRole}
                    >
                        {Object.values(Roles)
                            .filter((role) => {
                                if (userRole !== Roles.SuperAdmin) {
                                    return role !== Roles.SuperAdmin;
                                } else {
                                    return role;
                                }
                            })
                            .map((role) => (
                                <FormControlLabel
                                    disabled={!shouldEdit}
                                    key={role}
                                    value={role}
                                    control={<Radio />}
                                    label={t(`admin:role-${role}`)}
                                />
                            ))}
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={10} mt={2}>
                <Label>{t("menu:badgesItem")}</Label>
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
                    <Button onClick={handleClickSave}>
                        {t("admin:saveButtonLabel")}
                    </Button>
                )}
            </Grid>
        </>
    );
};

export default UserEditForm;
