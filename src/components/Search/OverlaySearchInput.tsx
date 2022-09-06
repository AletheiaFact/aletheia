import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import React from "react";
import { useDispatch } from "react-redux";
import SearchApi from "../../api/searchApi";
import { useAppSelector } from "../../store/store";
import { ActionTypes } from "../../store/types";
import InputSearch from "../Form/InputSearch";

const OverlaySearchInput = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const { page, pageSize } = useAppSelector((state) => {
        return {
            page: state?.search?.searchCurPage || 1,
            pageSize: state?.search?.searchPageSize || 5,
        };
    });

    const handleInputSearch = (name) => {
        dispatch({
            type: ActionTypes.SET_SEARCH_NAME,
            searchName: name,
        });

        SearchApi.getResults(dispatch, {
            page,
            pageSize,
            searchText: name,
        });
    };

    return (
        <InputSearch
            placeholder={t("header:search_personality")}
            callback={handleInputSearch}
            suffix={<SearchOutlined />}
        />
    );
};

export default OverlaySearchInput;
