import EditIcon from "@mui/icons-material/Edit";
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

import { startEditingUser, atomUserList } from "../../atoms/userEdit";
import { User } from "../../types/User";

const AdminView = () => {
    const { t } = useTranslation();
    // this is a write only atom, so we don't need to use the value
    const [, startEditing] = useAtom(startEditingUser);
    const [userList] = useAtom(atomUserList);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleEdit = React.useCallback(
        (userId) => () => {
            startEditing(userId);
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
                        icon={<EditIcon color="primary" />}
                        onClick={handleEdit(params.id)}
                        label="Delete"
                    />,
                ],
            },
        ],
        [handleEdit, t]
    );

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
                {userList && (
                    <DataGrid
                        rows={userList}
                        columns={columns}
                        pageSize={rowsPerPage}
                        rowsPerPageOptions={[5, 10, 50]}
                        onPageSizeChange={setRowsPerPage}
                        getRowId={(row) => row._id}
                        autoHeight
                        sx={{
                            "& .MuiTablePagination-toolbar p": {
                                marginBottom: 0,
                            },
                        }}
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default AdminView;
