import {
    DataGrid,
    GridActionsCellItem,
    GridColumns,
    GridRowParams,
} from "@mui/x-data-grid";
import { useTranslation } from "next-i18next";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { Button, Grid } from "@mui/material";
import { useAtom } from "jotai";
import { isEditDrawerOpen, startEditingItem } from "../../atoms/editDrawer";
import { atomNameSpacesList } from "../../atoms/namespace";
import { NameSpace } from "../../types/namespace";

const NameSpaceView = () => {
    const { t } = useTranslation();
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [, setVisible] = useAtom(isEditDrawerOpen);
    const [nameSpaces] = useAtom(atomNameSpacesList);
    const [, setNameSpaceToEdit] = useAtom(startEditingItem);

    const handleEdit = React.useCallback(
        (nameSpaceId) => () => {
            setNameSpaceToEdit({
                itemId: nameSpaceId,
                listAtom: atomNameSpacesList,
            });
            setVisible(true);
        },
        [setVisible, setNameSpaceToEdit]
    );

    const handleAddButtonClick = () => {
        setVisible(true);
    };

    const columns = React.useMemo<GridColumns<NameSpace>>(
        () => [
            {
                field: "name",
                headerName: "nome",
                flex: 2,
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
            my={2}
        >
            <Grid item xs={10}>
                <h2>{t("namespaces:title")}</h2>
            </Grid>
            <Grid item xs={10} sx={{ height: "auto", overflow: "auto" }}>
                {nameSpaces && (
                    <DataGrid
                        rows={nameSpaces}
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
                    {t("namespaces:addNameSpace")}
                </Button>
            </Grid>
        </Grid>
    );
};

export default NameSpaceView;
