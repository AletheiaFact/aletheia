import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const PaginatedDataGrid = ({ rows, columns, sx }) => {
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: 10,
        page: 0,
    });

    return (
        <DataGrid
            rows={rows}
            columns={columns}
            paginationModel={paginationModel}
            pageSizeOptions={[5, 10, 50]}
            onPaginationModelChange={setPaginationModel}
            getRowId={(row) => row._id}
            autoHeight
            sx={sx}
        />
    );
};

export default PaginatedDataGrid;
