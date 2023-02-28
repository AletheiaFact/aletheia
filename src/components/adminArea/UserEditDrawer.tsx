import React, { useEffect, useState } from "react";
import LargeDrawer from "../LargeDrawer";
import { useAtom } from "jotai";
import { atomUserList, userBeingEdited } from "../../atoms/userEdit";
import {
    Button,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { Roles } from "../../types/enums";
import Label from "../Label";
import userApi from "../../api/userApi";
import { finishEditingItem, isEditDrawerOpen } from "../../atoms/editDrawer";

const UserEditDrawer = () => {
    const { t } = useTranslation();
    const [visible, setVisible] = useAtom(isEditDrawerOpen);
    const [currentUser] = useAtom(userBeingEdited);
    const [, finishEditing] = useAtom(finishEditingItem);
    const [userRole, setUserRole] = useState(
        currentUser?.role || Roles.Regular
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserRole(event.target.value as Roles);
    };

    useEffect(() => {
        setUserRole(currentUser?.role || Roles.Regular);
    }, [currentUser]);

    const handleClickSave = () => {
        userApi
            .updateRole({ userId: currentUser?._id, role: userRole }, t)
            .then(() => {
                finishEditing({
                    newItem: { ...currentUser, role: userRole },
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
                            value={userRole}
                            onChange={handleChange}
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
