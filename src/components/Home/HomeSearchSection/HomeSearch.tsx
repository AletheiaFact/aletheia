import React, { useState } from "react";
import { Box, InputBase, Stack, Typography } from "@mui/material";
import { ArrowForward, SearchOutlined } from "@mui/icons-material";
import SearchApi from "../../../api/searchApi";
import { ActionTypes } from "../../../store/types";
import { useDispatch } from "react-redux";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../atoms/namespace";
import { useTranslations } from "next-intl";

const HomeSearch = () => {
    const tHome = useTranslations("home");
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [nameSpace] = useAtom(currentNameSpace);

    const handleInputSearch = async () => {
        if (!isLoading && name.length > 3) {
            setIsLoading(true);
            const { personalities, sentences, claims } =
                await SearchApi.getFeedResults({
                    page: 1,
                    pageSize: 5,
                    searchText: name,
                    nameSpace: nameSpace,
                });
            dispatch({
                type: ActionTypes.SEARCH_RESULTS,
                results: { personalities, sentences, claims },
            });
            setIsLoading(false);
        }
    };

    return (
        <Stack spacing={3} className="home-header-search-content">
            <Stack spacing={1} className="home-header-search-heading">
                <Typography
                    component="h2"
                    className="home-header-search-title"
                >
                    {tHome("homeHeaderSearchTitle")}
                </Typography>
                <Typography
                    component="p"
                    className="home-header-search-description"
                >
                    {tHome("homeHeaderSearchDescription")}
                </Typography>
            </Stack>

            <Box className="home-header-search-box">
                <Box component="span" className="home-header-search-icon">
                    <SearchOutlined />
                </Box>
                <InputBase
                    fullWidth
                    value={name}
                    placeholder={tHome("homeHeaderSearchPlaceholder")}
                    className="home-header-search-input"
                    onChange={({ target }) => setName(target.value)}
                    onKeyDown={({ key }) => {
                        if (key === "Enter") handleInputSearch();
                    }}
                    inputProps={{ "data-cy": "testInputSearchOverlay" }}
                />
                <AletheiaButton
                    type={ButtonType.lightBlue}
                    onClick={handleInputSearch}
                    disabled={name.length <= 3}
                    loading={isLoading}
                    className="home-header-search-button"
                >
                    {tHome("homeHeaderSearchButton")}
                    <ArrowForward className="home-header-search-button-icon" />
                </AletheiaButton>
            </Box>
        </Stack>
    );
};

export default HomeSearch;
