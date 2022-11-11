import { EditFilled } from "@ant-design/icons";
import { Grid } from "@mui/material";
import {
    DataGrid,
    GridActionsCellItem,
    GridColumns,
    GridRowParams,
    GridValueGetterParams,
} from "@mui/x-data-grid";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";

import { startEditingUser } from "../../atoms/userEdit";
import { Roles } from "../../types/enums";
import { User } from "../../types/User";

const AdminView = () => {
    const { t } = useTranslation();
    // this is a write only atom, so we don't need to use the value
    const [, startEditing] = useAtom(startEditingUser);

    const handleEdit = React.useCallback(
        (user: User) => () => {
            startEditing(user);
        },
        [startEditing]
    );

    const columns = React.useMemo<GridColumns<User>>(
        () => [
            {
                field: "name",
                headerName: t("admin:columnName"),
                flex: 1,
            },
            {
                field: "email",
                headerName: t("admin:columnEmail"),
                flex: 2,
            },
            {
                field: "role",
                headerName: t("admin:columnRole"),
                flex: 1,
                valueGetter: (params: GridValueGetterParams) => {
                    return t(`admin:role-${params.row.role}`);
                },
            },
            {
                field: "actions",
                type: "actions",
                width: 100,
                headerName: t("admin:columnEdit"),
                getActions: (params: GridRowParams) => [
                    <GridActionsCellItem
                        icon={<EditFilled color="primary" />}
                        onClick={handleEdit(params.row as User)}
                        label="Delete"
                    />,
                ],
            },
        ],
        [handleEdit, t]
    );

    const rows: User[] = [
        {
            _id: "1",
            name: "Snow",
            email: "Jon.Snow@aletheiafact.org",
            role: Roles.Admin,
        },
        {
            _id: "2",
            name: "Lannister",
            email: "Cersei.Lannister@aletheiafact.org",
            role: Roles.Regular,
        },
        {
            _id: "3",
            name: "Lannister",
            email: "Jaime.Lannister@aletheiafact.org",
            role: Roles.Regular,
        },
        {
            _id: "4",
            name: "Stark",
            email: "Arya.Stark@aletheiafact.org",
            role: Roles.Regular,
        },
        {
            _id: "5",
            name: "Targaryen",
            email: "Daenerys.Targaryen@aletheiafact.org",
            role: Roles.Admin,
        },
        {
            _id: "6",
            name: "Melisandre",
            email: "Melisandre@aletheiafact.org",
            role: Roles.FactChecker,
        },
        {
            _id: "7",
            name: "Clifford",
            email: "Ferrara.Clifford@aletheiafact.org",
            role: Roles.FactChecker,
        },
        {
            _id: "8",
            name: "Frances",
            email: "Rossini.Frances@aletheiafact.org",
            role: Roles.Regular,
        },
        {
            _id: "9",
            name: "Roxie",
            email: "Harvey.Roxie@aletheiafact.org",
            role: Roles.Regular,
        },
        {
            _id: "10",
            name: "Byron",
            email: "Byron@aletheiafact.org",
            role: Roles.Regular,
        },
    ];

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="stretch"
            spacing={1}
            my={2}
        >
            <Grid item xs={10}>
                <h2>{t("admin:adminTitle")}</h2>
            </Grid>
            <Grid item xs={10} sx={{ height: "auto", overflow: "auto" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    getRowId={(row) => row._id}
                    autoHeight
                />
            </Grid>
        </Grid>
    );
};

export default AdminView;
