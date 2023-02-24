import {
    DataGrid,
    GridActionsCellItem,
    GridColumns,
    GridRowParams,
} from "@mui/x-data-grid";
import { useTranslation } from "next-i18next";
import React from "react";
import { Badge } from "../../types/Badge";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, Button, Grid } from "@mui/material";
import { useAtom } from "jotai";
import { badgesList, isBadgesFormOpen } from "../../atoms/badgesForm";

const BadgesView = () => {
    const { t } = useTranslation();
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [, setVisible] = useAtom(isBadgesFormOpen);
    const [badges] = useAtom(badgesList);
    const handleEdit = React.useCallback(
        (badgeId) => () => {
            console.log("edit", badgeId);
            setVisible(true);
        },
        [setVisible]
    );

    const handleAddButtonClick = () => {
        setVisible(true);
    };

    const columns = React.useMemo<GridColumns<Badge>>(
        () => [
            {
                field: "image",
                headerName: t("badges:imageColumn"),
                flex: 1,
                renderCell: (params) => (
                    <Avatar src={params.value.content} alt={params.row.name} />
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
                    <DataGrid
                        rows={badges}
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
