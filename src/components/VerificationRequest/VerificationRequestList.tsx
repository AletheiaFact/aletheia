import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import verificationRequestApi from "../../api/verificationRequestApi";
import AletheiaButton from "../Button";
import { Grid } from "@mui/material";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowParams,
} from "@mui/x-data-grid";
import colors from "../../styles/colors";

const VerificationRequestList = () => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const [verificationRequests, setVerificationRequests] = useState([]);
    const [totalVerificationRequests, setTotalVerificationRequests] =
        useState(0);
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 10,
        page: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await verificationRequestApi.get({
                    page: paginationModel.page + 1,
                    pageSize: paginationModel.pageSize,
                });
                if (response) {
                    setVerificationRequests(response.data);
                    setTotalVerificationRequests(
                        response.totalVerificationRequests
                    );
                }
            } catch (error) {
                console.error("Error fetching verification requests:", error);
            }
        };

        fetchData();
    }, [paginationModel, nameSpace]);

    const handleRedirect = useCallback(
        (data_hash) => () => {
            window.location.href = `/verification-request/${data_hash}`;
        },
        []
    );

    const columns = React.useMemo<GridColDef[]>(
        () => [
            {
                field: "content",
                headerName: t(
                    "verificationRequest:verificationRequestTagContent"
                ),
                flex: 1,
                valueGetter: (value, row) => row.content,
                renderCell: (params) => (
                    <span>{truncateWithEllipsis(params.value, 50)}</span>
                ),
            },
            {
                field: "heardFrom",
                headerName: t(
                    "verificationRequest:verificationRequestTagHeardFrom"
                ),
                flex: 1,
                valueGetter: (value, row) => row.heardFrom || "",
                renderCell: (params) => (
                    <span>{truncateWithEllipsis(params.value, 30)}</span>
                ),
            },
            {
                field: "publicationDate",
                headerName: t(
                    "verificationRequest:verificationRequestTagPublicationDate"
                ),
                flex: 1,
                valueGetter: (value, row) =>
                    row.publicationDate
                        ? new Date(row.publicationDate).toLocaleDateString()
                        : "",
            },
            {
                field: "source",
                headerName: t(
                    "verificationRequest:verificationRequestTagSource"
                ),
                flex: 1,
                valueGetter: (value, row) => row.source?.href || "",
                renderCell: (params) => (
                    <span>{truncateWithEllipsis(params.value, 30)}</span>
                ),
            },
            {
                field: "date",
                headerName: t("verificationRequest:verificationRequestTagDate"),
                flex: 1,
                valueGetter: (value, row) =>
                    row.date ? new Date(row.date).toLocaleDateString() : "",
            },
            {
                field: "viewRequest",
                type: "actions",
                headerName: t(
                    "verificationRequest:verificationRequestViewRequest"
                ),
                width: 150,
                getActions: (params: GridRowParams) => [
                    <GridActionsCellItem
                        key={`viewRequest-${params.row.data_hash}`}
                        icon={
                            <AletheiaButton>
                                {t(
                                    "verificationRequest:openVerificationRequest"
                                )}
                            </AletheiaButton>
                        }
                        onClick={handleRedirect(params.row.data_hash)}
                        label={t("verificationRequest:openVerificationRequest")}
                    />,
                ],
            },
        ],
        [handleRedirect, t]
    );

    const truncateWithEllipsis = useCallback((value, maxLength) => {
        if (!value) return "";
        const truncatedValue = value.substring(0, maxLength);
        return value.length > maxLength
            ? `${truncatedValue}...`
            : truncatedValue;
    }, []);

    return (
        <Grid
            container
            justifyContent="center"
            alignItems="stretch"
            spacing={1}
            my={2}
        >
            <Grid item xs={10}>
                <h2>
                    {t("verificationRequest:verificationRequestListHeader")}
                </h2>
            </Grid>
            <Grid item xs={10} sx={{ height: "auto", overflow: "auto" }}>
                <DataGrid
                    rows={verificationRequests}
                    columns={columns}
                    paginationModel={paginationModel}
                    pageSizeOptions={[5, 10, 50]}
                    onPaginationModelChange={setPaginationModel}
                    getRowId={(row) => row._id}
                    autoHeight
                    rowCount={totalVerificationRequests}
                    paginationMode="server"
                    sx={{
                        "& .MuiDataGrid-columnHeader": {
                            backgroundColor: colors.lightGraySecondary,
                            color: colors.bluePrimary,
                            fontWeight: "bold",
                            borderBottom: `2px solid ${colors.blueSecondary}`,
                        },
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default VerificationRequestList;
