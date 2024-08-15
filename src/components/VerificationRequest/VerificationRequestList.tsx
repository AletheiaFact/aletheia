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

const VerificationRequestList = () => {
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const [verificationRequests, setVerificationRequests] = useState([]);
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 10,
        page: 0,
    });

    const truncateWithEllipsis = (value, maxLength) => {
        if (!value) return "";
        const truncatedValue = value.substring(0, maxLength);
        return value.length > maxLength
            ? `${truncatedValue}...`
            : truncatedValue;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await verificationRequestApi.get({});
                if (response && response.data) {
                    setVerificationRequests(response.data);
                }
            } catch (error) {
                console.error("Error fetching verification requests:", error);
            }
        };
        fetchData();
    }, [nameSpace]);

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
                        key={`viewRequest-${params.id}`}
                        icon={
                            <AletheiaButton>
                                {t(
                                    "verificationRequest:openVerificationRequest"
                                )}
                            </AletheiaButton>
                        }
                        onClick={handleRedirect(params.id)}
                        label={t("verificationRequest:openVerificationRequest")}
                    />,
                ],
            },
        ],
        [handleRedirect, t]
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
                <h2>
                    {t("verificationRequest:verificationRequestListHeader")}
                </h2>
            </Grid>
            <Grid item xs={10} sx={{ height: "auto", overflow: "auto" }}>
                <DataGrid
                    rows={verificationRequests}
                    columns={columns}
                    paginationModel={paginationModel}
                    pageSizeOptions={[5, 10, 25]}
                    onPaginationModelChange={setPaginationModel}
                    getRowId={(row) => row.data_hash}
                    autoHeight
                    sx={{ height: "100%" }}
                />
            </Grid>
        </Grid>
    );
};

export default VerificationRequestList;
