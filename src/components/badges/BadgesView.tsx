import React from "react";
import { Avatar, Grid } from "@mui/material";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import EditIcon from "@mui/icons-material/Edit";
import { useAtom } from "jotai";
import {
    GridActionsCellItem,
    GridColDef,
    GridRowParams,
} from "@mui/x-data-grid";
import { isEditDrawerOpen, startEditingItem } from "../../atoms/editDrawer";
import { atomBadgesList } from "../../atoms/badges";
import { Badge } from "../../types/Badge";
import PaginatedDataGrid from "../PaginetedDataGrid";
import { useTranslations } from "next-intl";

const BadgesView = () => {
    const tBadges = useTranslations("badges");
    const tAdmin = useTranslations("admin");
    const t = useTranslations();
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
                headerName: tBadges("imageFieldLabel"),
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
                headerName: tBadges("nameLabel"),
                flex: 2,
            },
            {
                field: "description",
                headerName: tBadges("descriptionLabel"),
                flex: 4,
            },
            {
                field: "actions",
                type: "actions",
                width: 100,
                headerName: tAdmin("columnEdit"),
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
                <h2>{tBadges("title")}</h2>
            </Grid>
            <Grid item xs={10} sx={{ height: "auto", overflow: "auto" }}>
                {badges && (
                    <PaginatedDataGrid
                        rows={badges}
                        columns={columns}
                        sx={{
                            "& .MuiTablePagination-toolbar p": {
                                marginBottom: 0,
                            },
                        }}
                    />
                )}
            </Grid>
            <Grid item xs={10} mt={5} display="flex" justifyContent="end">
                <AletheiaButton
                    type={ButtonType.primary}
                    onClick={handleAddButtonClick}
                >
                    {tBadges("addBadge")}
                </AletheiaButton>
            </Grid>
        </Grid>
    );
};

export default BadgesView;
