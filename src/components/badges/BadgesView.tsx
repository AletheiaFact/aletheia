import React from "react";
import { useTranslation } from "next-i18next";
import { Avatar, Button, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAtom } from "jotai";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowParams,
} from "@mui/x-data-grid";
import { isEditDrawerOpen, startEditingItem } from "../../atoms/editDrawer";
import { atomBadgesList } from "../../atoms/badges";
import { Badge } from "../../types/Badge";
import PaginatedDataGrid from "../PaginetedDataGrid";

const BadgesView = () => {
    const { t } = useTranslation();
    const [, setVisible] = useAtom(isEditDrawerOpen);
    const [badges] = useAtom(atomBadgesList);
    const [, setBadgeToEdit] = useAtom(startEditingItem);

    const handleEdit = React.useCallback(
        (badgeId) => () => {
            setBadgeToEdit({ itemId: badgeId, listAtom: atomBadgesList });
            setVisible(true);
        },
        [setVisible, setBadgeToEdit]
    );

    const handleAddButtonClick = () => {
        setVisible(true);
    };

    const columns = React.useMemo<GridColDef<Badge>[]>(
        () => [
            {
                field: "image",
                headerName: t("badges:imageColumn"),
                flex: 1,
                renderCell: (params) => (
                    <Avatar
                        src={params?.value?.content}
                        alt={params.row.name}
                    />
                ),
            },
            {
                field: "name",
                headerName: t("badges:nameColumn"),
                flex: 2,
            },
            {
                field: "description",
                headerName: t("badges:descriptionColumn"),
                flex: 4,
            },
            {
                field: "actions",
                type: "actions",
                width: 100,
                headerName: t("admin:columnEdit"),
                getActions: (params: GridRowParams) => [
                    <GridActionsCellItem
                        key={params.id}
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
            my={2} // vertical margin
        >
            <Grid item xs={10}>
                <h2>{t("badges:title")}</h2>
            </Grid>
            <Grid item xs={10} sx={{ height: "auto", overflow: "auto" }}>
                {badges && (
                    <PaginatedDataGrid rows={badges} columns={columns} />
                )}
            </Grid>
            <Grid item xs={10} mt={5} display="flex" justifyContent="end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddButtonClick}
                >
                    {t("badges:addBadge")}
                </Button>
            </Grid>
        </Grid>
    );
};

export default BadgesView;
