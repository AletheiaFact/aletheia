import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import React from "react";
import { useDispatch } from "react-redux";
import SearchApi from "../../api/searchApi";
import { ActionTypes } from "../../store/types";
import InputSearch from "../Form/InputSearch";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import actions from "../../store/actions";

const OverlaySearchInput = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [nameSpace] = useAtom(currentNameSpace);

    const handleInputSearch = async (searchText) => {
        dispatch({
            type: ActionTypes.SET_SEARCH_OVERLAY_NAME,
            searchOverlayInput: searchText,
        });

        const { personalities, sentences, claims } =
            await SearchApi.getFeedResults({
                page: 1,
                pageSize: 5,
                searchText: searchText,
                nameSpace: nameSpace,
            });

        dispatch(actions.openResultsOverlay());
        dispatch({
            type: ActionTypes.SEARCH_OVERLAY_RESULTS,
            searchOverlayResults: { personalities, sentences, claims },
        });
    };

    return (
        <InputSearch
            placeholder={t("header:search_placeholder")}
            callback={handleInputSearch}
            suffix={<SearchOutlined />}
            data-cy={"testInputSearchOverlay"}
        />
    );
};

export default OverlaySearchInput;
