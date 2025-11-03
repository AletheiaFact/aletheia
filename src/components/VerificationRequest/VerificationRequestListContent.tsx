import React, { useCallback } from "react";
import { Grid } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
} from "@mui/x-data-grid";
import VerificationRequestBoardView from "./VerificationRequestBoardView";
import colors from "../../styles/colors";
import InfoTooltip from "../Claim/InfoTooltip";
import { InfoOutlined } from "@mui/icons-material";
import AletheiaButton from "../Button";

const VerificationRequestListContent = ({ state, actions }) => {
  const {
    loading,
    viewMode,
    paginationModel,
    filteredRequests,
    totalVerificationRequests,
  } = state;
  const { setPaginationModel, setApplyFilters, t } = actions;

  const formatPublicationDate = (dateString) => {
    const publicationDate = new Date(dateString);
    const isValidDate = !Number.isNaN(publicationDate.getTime());

    return isValidDate ? publicationDate.toLocaleDateString() : dateString;
  };

  const truncateWithEllipsis = useCallback((value, maxLength) => {
    if (!value) return "";
    return value.length > maxLength
      ? `${value.substring(0, maxLength)}...`
      : value;
  }, []);

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "content",
        headerName: t("verificationRequest:tagReportedContent"),
        flex: 1,
        valueGetter: (value, row) => row.content,
        renderCell: (params) => (
          <span>{truncateWithEllipsis(params.value, 50)}</span>
        ),
      },
      {
        field: "reportType",
        headerName: t("verificationRequest:tagReportType"),
        flex: 1,
        valueGetter: (value, row) => row.reportType || "",
        renderCell: (params) => (
          <span>
            {truncateWithEllipsis(t(`claimForm:${params.value}`), 50)}
          </span>
        ),
      },
      {
        field: "impactArea",
        headerName: t("verificationRequest:tagImpactArea"),
        flex: 1,
        valueGetter: (value, row) => row.impactArea?.name || "",
        renderCell: (params) => (
          <span>{truncateWithEllipsis(params.value, 50)}</span>
        ),
      },
      {
        field: "heardFrom",
        headerName: t("verificationRequest:tagHeardFrom"),
        flex: 1,
        valueGetter: (value, row) => row.heardFrom || "",
        renderCell: (params) => (
          <span>{truncateWithEllipsis(params.value, 30)}</span>
        ),
      },
      {
        field: "publicationDate",
        headerName: t("verificationRequest:tagPublicationDate"),
        flex: 1,
        valueGetter: (value, row) =>
          row.publicationDate ? formatPublicationDate(row.publicationDate) : "",
      },
      {
        field: "source",
        headerName: t("verificationRequest:tagSource"),
        flex: 1,
        valueGetter: (value, row) => row.source || [],
        renderCell: (params) => {
          const firstSource = params.value[0]?.href;

          return (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ overflow: "hidden" }}>
                {truncateWithEllipsis(firstSource, 30)}
              </span>
              {params.value.length > 1 && (
                <InfoTooltip
                  placement="top"
                  content={t("verificationRequest:seeAllSources")}
                  useCustomStyle={false}
                >
                  <InfoOutlined
                    style={{ color: colors.neutralSecondary }}
                    fontSize="inherit"
                  />
                </InfoTooltip>
              )}
            </div>
          );
        },
      },
      {
        field: "date",
        headerName: t("verificationRequest:tagDate"),
        flex: 1,
        valueGetter: (value, row) =>
          row.date ? new Date(row.date).toLocaleDateString() : "",
      },
      {
        field: "sourceChannel",
        headerName: t("verificationRequest:tagSourceChannel"),
        flex: 1,
        valueGetter: (value, row) => row.sourceChannel || "",
      },
      {
        field: "severity",
        headerName: t("verificationRequest:tagSeverity"),
        flex: 1,
        valueGetter: (value, row) => row.severity || "Alta", // Dynamic Field: It must be populated with the severy of the Verification Request
      },
      {
        field: "viewRequest",
        type: "actions",
        headerName: t("verificationRequest:verificationRequestViewRequest"),
        width: 150,
        getActions: (params: GridRowParams) => [
          <GridActionsCellItem
            key={`viewRequest-${params.row.data_hash}`}
            icon={
              <AletheiaButton>
                {t("verificationRequest:openVerificationRequest")}
              </AletheiaButton>
            }
            onClick={() => {
              globalThis.location.href = `/verification-request/${params.row.data_hash}`;
            }}
            label={t("verificationRequest:openVerificationRequest")}
          />,
        ],
      },
    ],
    [t]
  );

  const handlePaginationChange = (newModel) => {
    setPaginationModel(newModel);
    setApplyFilters(true);
  };

  return viewMode === "list" ? (
    <Grid item xs={10} sx={{ height: "auto", overflow: "auto" }}>
      <DataGrid
        rows={filteredRequests}
        columns={columns}
        paginationModel={paginationModel}
        pageSizeOptions={[5, 10, 50]}
        onPaginationModelChange={handlePaginationChange}
        getRowId={(row) => row._id}
        rowCount={totalVerificationRequests}
        paginationMode="server"
        loading={loading}
        sx={{
          height: "auto",
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: colors.lightNeutralSecondary,
            color: colors.primary,
            fontWeight: "bold",
            borderBottom: `2px solid ${colors.secondary}`,
          },
          "& .MuiIconButton-root": {
            color: colors.primary,
          },
        }}
      />
    </Grid>
  ) : (
    <Grid item xs={12}>
      <VerificationRequestBoardView
        requests={filteredRequests}
        loading={loading}
      />
    </Grid>
  );
};

export default VerificationRequestListContent;
