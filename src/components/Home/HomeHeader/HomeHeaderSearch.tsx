import React, { useState } from "react";
import InputSearch from "../../Form/InputSearch";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../store/store";
import SearchApi from "../../../api/searchApi";
import { ActionTypes } from "../../../store/types";
import { useDispatch } from "react-redux";
import AletheiaButton, { ButtonType } from "../../Button";
import HomeHeaderSearchStyled from "./HomeHeaderSearch.style";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../atoms/namespace";

const HomeHeaderSearch = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [nameSpace] = useAtom(currentNameSpace);

    const { vw } = useAppSelector((state) => ({
        vw: state.vw,
    }));

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
        <HomeHeaderSearchStyled xxl={12} lg={16} sm={18} xs={24}>
            <h2 className="title">{t("home:homeHeaderSearchTitle")}</h2>

            <InputSearch
                placeholder={t("header:search_placeholder")}
                prefix={
                    <SearchOutlined style={{ fontSize: 24, marginRight: 16 }} />
                }
                data-cy={"testInputSearchOverlay"}
                onChange={({ target }) => setName(target.value)}
                onKeyDown={({ key }) => {
                    if (key === "Enter") {
                        handleInputSearch();
                    }
                }}
            />

            {!vw?.xs && (
                <AletheiaButton
                    type={ButtonType.lightBlue}
                    onClick={handleInputSearch}
                    style={{ width: "180px" }}
                    disabled={name.length <= 3}
                    loading={isLoading}
                >
                    {t("home:homeHeaderSearchButton")}
                </AletheiaButton>
            )}
        </HomeHeaderSearchStyled>
    );
};

export default HomeHeaderSearch;