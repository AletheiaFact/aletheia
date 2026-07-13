import React from "react";
import { Grid } from "@mui/material";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import EditIcon from "@mui/icons-material/Edit";
import { useAtom } from "jotai";
import {
    GridActionsCellItem,
    GridColDef,
    GridRowParams,
} from "@mui/x-data-grid";
import { isEditDrawerOpen, startEditingItem } from "../../atoms/editDrawer";
import { atomNameSpacesList } from "../../atoms/namespace";
import { NameSpace } from "../../types/Namespace";
import PaginatedDataGrid from "../PaginetedDataGrid";
import { useTranslations } from "next-intl";

const NameSpaceView = () => {
    const tNamespaces = useTranslations("namespaces");
    const tAdmin = useTranslations("admin");
    const t = useTranslations();
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
                headerName: tNamespaces("nameLabel"),
                flex: 2,
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
            my={2}
        >
            <Grid item xs={10}>
                <h2>{tNamespaces("title")}</h2>
            </Grid>
            <Grid item xs={10} sx={{ height: "auto", overflow: "auto" }}>
                {nameSpaces && (
                    <PaginatedDataGrid
                        rows={nameSpaces}
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
                    {tNamespaces("addNameSpace")}
                </AletheiaButton>
            </Grid>
        </Grid>
    );
};

export default NameSpaceView;
