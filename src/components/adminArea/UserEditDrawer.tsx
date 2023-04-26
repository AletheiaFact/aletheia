import React, { useEffect, useState } from "react";
import LargeDrawer from "../LargeDrawer";
import { useAtom } from "jotai";
import { atomUserList, userBeingEdited } from "../../atoms/userEdit";
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { Roles } from "../../types/enums";
import Label from "../Label";
import userApi from "../../api/userApi";
import { finishEditingItem, isEditDrawerOpen } from "../../atoms/editDrawer";
import { atomBadgesList } from "../../atoms/badges";
import { Badge } from "../../types/Badge";

const UserEditDrawer = () => {
    const { t } = useTranslation();
    const [visible, setVisible] = useAtom(isEditDrawerOpen);
    const [currentUser] = useAtom(userBeingEdited);
    const [, finishEditing] = useAtom(finishEditingItem);
    const [badgesList] = useAtom(atomBadgesList);
    const [role, setUserRole] = useState(currentUser?.role || Roles.Regular);
    const [badges, setBadges] = useState([]);

    const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserRole(event.target.value as Roles);
    };

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
    }, [badgesList, currentUser]);

    const handleClickSave = () => {
        const sendBadges = badges.map((badge) => badge._id);
        userApi
            .update(currentUser?._id, { role, badges: sendBadges }, t)
            .then(() => {
                finishEditing({
                    newItem: { ...currentUser, role, badges },
                    listAtom: atomUserList,
                });
            });
    };

    return (
        <LargeDrawer
            visible={visible}
            onClose={() => {
                setVisible(false);
            }}
        >
            <Grid
                container
                justifyContent="center"
                alignItems="stretch"
                spacing={1}
                mt={2}
            >
                <Grid item xs={10}>
                    <h2>{t("admin:editDrawerTitle")}</h2>
                    <h3>
                        {currentUser?.name} - {currentUser?.email}
                    </h3>
                    <Divider />
                </Grid>
                <Grid item xs={10} mt={2}>
                    <FormControl>
                        <Label>{t("admin:columnRole")}</Label>
                        <RadioGroup
                            row
                            name="roles"
                            value={role}
                            onChange={handleChangeRole}
                        >
                            {Object.values(Roles).map((role) => (
                                <FormControlLabel
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickSave}
                    >
                        {t("admin:saveButtonLabel")}
                    </Button>
                </Grid>
            </Grid>
        </LargeDrawer>
    );
};

export default UserEditDrawer;
