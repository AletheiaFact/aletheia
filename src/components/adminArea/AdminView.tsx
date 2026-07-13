import EditIcon from "@mui/icons-material/Edit";
import { Avatar, AvatarGroup, Grid } from "@mui/material";
import {
    GridActionsCellItem,
    GridColDef,
    GridRowParams,
} from "@mui/x-data-grid";
import { useAtom } from "jotai";
import React from "react";
import { startEditingItem } from "../../atoms/editDrawer";
import { atomUserList } from "../../atoms/userEdit";
import { User } from "../../types/User";
import HeaderUserStatus from "./Drawer/HeaderUserStatus";
import HeaderTotpStatus from "./Drawer/HeaderTotpStatus";
import { currentNameSpace } from "../../atoms/namespace";
import PaginatedDataGrid from "../PaginetedDataGrid";
import { useTranslations } from "next-intl";

const AdminView = () => {
    const tAdmin = useTranslations("admin");
    // this is a write only atom, so we don't need to use the value
    const [, startEditing] = useAtom(startEditingItem);
    const [userList] = useAtom(atomUserList);
    const [nameSpace] = useAtom(currentNameSpace);

    const handleEdit = React.useCallback(
        (userId) => () => {
            startEditing({ itemId: userId, listAtom: atomUserList });
        },
        [startEditing]
    );

    const columns = React.useMemo<GridColDef<User>[]>(
        () => [
            {
                field: "name",
                headerName: tAdmin("columnName"),
                flex: 1,
            },
            {
                field: "email",
                headerName: tAdmin("columnEmail"),
                flex: 2,
            },
            {
                field: "role",
                headerName: tAdmin("columnRole"),
                flex: 1,
                valueGetter: (value, row) =>
                    tAdmin(`role-${row.role[nameSpace]}`),
            },
            {
                field: "badges",
                headerName: tAdmin("columnBadges"),
                flex: 1,
                valueGetter: (value, row) => row.badges || "",
                renderCell: (params) => (
                    <AvatarGroup max={4}>
                        {params?.value &&
                            params?.value?.map((badge) => {
                                return (
                                    <Avatar
                                        key={badge._id}
                                        title={badge?.name}
                                        src={badge?.image?.content}
                                        alt={badge}
                                    />
                                );
                            })}
                    </AvatarGroup>
                ),
            },
            {
                field: "state",
                headerName: tAdmin("columnStatus"),
                flex: 1,
                valueGetter: (value, row) => row.state,
                renderCell: (params) => (
                    <HeaderUserStatus status={params.value} />
                ),
            },
            {
                field: "totp",
                headerName: tAdmin("columnTotp"),
                flex: 1,
                valueGetter: (value, row) => row.totp,
                renderCell: (params) => (
                    <HeaderTotpStatus status={params.value} />
                ),
            },
            {
                field: "actions",
                type: "actions",
                width: 100,
                headerName: tAdmin("columnEdit"),
                getActions: (params: GridRowParams) => [
                    <GridActionsCellItem
                        icon={<EditIcon color="primary" />}
                        onClick={handleEdit(params.id)}
                        label="Delete"
                    />,
                ],
            },
        ],
        [handleEdit, nameSpace, tAdmin]
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
                <h2>{tAdmin("adminTitle")}</h2>
            </Grid>
            <Grid item xs={10} sx={{ height: "auto", overflow: "auto" }}>
                {userList && (
                    <PaginatedDataGrid
                        rows={userList}
                        columns={columns}
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
