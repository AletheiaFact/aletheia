import { SearchOutlined } from "@mui/icons-material";
import React from "react";
import { useDispatch } from "react-redux";
import SearchApi from "../../api/searchApi";
import { ActionTypes } from "../../store/types";
import InputSearch from "../Form/InputSearch";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import actions from "../../store/actions";
import { useAppSelector } from "../../store/store";
import { useTranslations } from "next-intl";

const OverlaySearchInput = () => {
    const tHeader = useTranslations("header");
    const dispatch = useDispatch();
    const [nameSpace] = useAtom(currentNameSpace);

    const { page, pageSize } = useAppSelector((state) => {
        return {
            page: state?.search?.searchCurPage || 1,
            pageSize: state?.search?.searchPageSize || 5,
        };
    });

    const handleInputSearch = async (name) => {
        dispatch(actions.setResultsLoading(true));
        dispatch(actions.openResultsOverlay());
        dispatch({
            type: ActionTypes.SET_SEARCH_OVERLAY_NAME,
            searchOverlayInput: name,
        });

        const { personalities, sentences, claims } =
            await SearchApi.getFeedResults({
                page,
                pageSize,
                searchText: name,
                nameSpace: nameSpace,
            });

        dispatch(actions.setResultsLoading(false));
        dispatch(actions.openResultsOverlay());
        dispatch({
            type: ActionTypes.SEARCH_OVERLAY_RESULTS,
            searchOverlayResults: { personalities, sentences, claims },
        });
    };

    return (
        <InputSearch
            size="small"
            placeholder={tHeader("search_placeholder")}
            callback={handleInputSearch}
            suffix={<SearchOutlined />}
            data-cy={"testInputSearchOverlay"}
        />
    );
};

export default OverlaySearchInput;
