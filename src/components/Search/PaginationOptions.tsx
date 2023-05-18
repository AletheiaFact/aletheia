import { useRouter } from "next/router";
import React from "react";
import { Pagination, Stack } from "@mui/material";

function PaginationOptions({ pageSize, searchText, totalPages, page }) {
    const router = useRouter();

    const handlePageSizeChange = (event, value) => {
        router
            .push({
                pathname: "/search",
                query: {
                    searchText: searchText,
                    pageSize: pageSize,
                    page: value,
                },
            })
            .catch((error) => console.log(`Error: ${error.message}`));
    };

    return (
        <Stack spacing={2}>
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageSizeChange}
            />
        </Stack>
    );
}

export default PaginationOptions;
