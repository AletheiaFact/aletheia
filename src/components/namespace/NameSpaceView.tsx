import React from "react";
import { useTranslation } from "next-i18next";
import { Button, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAtom } from "jotai";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowParams,
} from "@mui/x-data-grid";
import { isEditDrawerOpen, startEditingItem } from "../../atoms/editDrawer";
import { atomNameSpacesList } from "../../atoms/namespace";
import { NameSpace } from "../../types/Namespace";

const NameSpaceView = () => {
    const { t } = useTranslation();
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 10,
        page: 0,
    });
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

    const columns = React.useMemo<GridColDef<NameSpace>[]>(
        () => [
            {
                field: "name",
                headerName: t("namespaces:nameColumn"),
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
                        paginationModel={paginationModel}
                        pageSizeOptions={[5, 10, 50]}
                        onPaginationModelChange={setPaginationModel}
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
