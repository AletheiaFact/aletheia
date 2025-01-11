import React from "react";
import {
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
} from "@mui/material";
import { Roles } from "../../../types/enums";
import Label from "../../Label";
import colors from "../../../styles/colors";
import { currentUserRole } from "../../../atoms/currentUser";
import { NameSpaceEnum } from "../../../types/Namespace";
import { currentNameSpace } from "../../../atoms/namespace";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";

const UserEditRoles = ({ currentUser, role, setUserRole, shouldEdit }) => {
    const { t } = useTranslation();
    const [userRole] = useAtom(currentUserRole);
    const [nameSpace] = useAtom(currentNameSpace);

    const currentUserRoles =
        nameSpace !== NameSpaceEnum.Main
            ? filterObjectByKeys(currentUser?.role, [nameSpace])
            : currentUser?.role;

    const getComponentColor = () =>
        nameSpace === NameSpaceEnum.Main ? colors.primary : colors.secondary;

    const handleChangeRole = (value: Roles, key) => {
        setUserRole((role) => {
            return {
                ...role,
                [key]: value,
            };
        });
    };

    function filterObjectByKeys(inputObject, keysToInclude) {
        const filteredObject = {};

        for (const key of keysToInclude) {
            if (inputObject?.hasOwnProperty(key)) {
                filteredObject[key] = inputObject[key];
            }
        }

        return filteredObject;
    }

    return (
        <>
            {currentUserRoles &&
                Object.keys(currentUserRoles).map((key) => (
                    <FormControl key={key} style={{ width: "100%" }}>
                        <fieldset
                            style={{
                                padding: 8,
                                border: `1px solid ${getComponentColor()}`,
                            }}
                        >
                            <legend style={{ width: "fit-content" }}>
                                {key}
                            </legend>
                            <Label>{t("admin:columnRole")}</Label>
                            <RadioGroup
                                row
                                name="roles"
                                value={role[key]}
                                onChange={({ target }) =>
                                    handleChangeRole(target.value as Roles, key)
                                }
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
                                            control={
                                                <Radio
                                                    style={{
                                                        color: getComponentColor(),
                                                    }}
                                                />
                                            }
                                            label={t(`admin:role-${role}`)}
                                        />
                                    ))}
                            </RadioGroup>
                        </fieldset>
                    </FormControl>
                ))}
        </>
    );
};

export default UserEditRoles;
