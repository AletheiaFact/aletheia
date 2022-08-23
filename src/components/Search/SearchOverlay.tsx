import { LeftCircleFilled, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import searchApi from "../../api/searchApi";
import { useAppSelector } from "../../store/store";
import { ActionTypes } from "../../store/types";
import colors from "../../styles/colors";
import InputSearch from "../Form/InputSearch";
import SearchCard from "./SearchCard";

const OverlayDiv = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;

    .ant-input-search.ant-input-affix-wrapper-lg {
        padding: 9px 14px;
    }

    .ant-input-lg {
        font-weight: 600;
    }

    .ant-input::placeholder {
        font-style: italic;
        font-weight: 300;
        font-size: 14px;
        line-height: 20px;
        color: ${colors.blackSecondary};
    }
`;

const SearchOverlay = ({ overlay }) => {
    const { personalities, sentences, claims, page, pageSize, searchName } =
        useAppSelector((state) => {
            return {
                personalities:
                    state?.search?.searchResults?.personalities || [],
                sentences: state?.search?.searchResults?.sentences || [],
                claims: state?.search?.searchResults?.claims || [],
                page: state?.search?.searchCurPage || 1,
                pageSize: state?.search?.searchPageSize || 5,
                searchName: state?.search?.searchInput || null,
            };
        });

    const handleSearchClick = ({
        type,
        claimSlug = "",
        personalitySlug = "",
        data_hash = "",
    }) => {
        dispatch({
            type: ActionTypes.ENABLE_SEARCH_OVERLAY,
            overlay: false,
        });
        switch (type) {
            case "personality":
                router.push(`/personality/${personalitySlug}`);
                break;
            case "claim":
                router.push(
                    `/personality/${personalitySlug}/claim/${claimSlug}`
                );
                break;
            case "sentence":
                router.push(
                    `/personality/${personalitySlug}/claim/${claimSlug}/sentence/${data_hash}`
                );
                break;
        }
    };

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const router = useRouter();

    const handleInputSearch = (name) => {
        dispatch({
            type: ActionTypes.SET_SEARCH_NAME,
            searchName: name,
        });

        searchApi.getResults(
            {
                page,
                pageSize,
                searchText: name,
                i18n,
            },
            dispatch
        );
    };
    console.log(sentences);

    return (
        <OverlayDiv>
            <Row
                className="aletheia-header"
                style={{
                    backgroundColor: colors.bluePrimary,
                    boxShadow: "0 2px 2px rgba(0, 0, 0, 0.1)",
                    height: "70px",
                    padding: "0 15px",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Col
                    span={3}
                    style={{
                        textAlign: "center",
                    }}
                >
                    <a
                        onClick={() => {
                            dispatch({
                                type: ActionTypes.ENABLE_SEARCH_OVERLAY,
                                overlay: false,
                            });
                        }}
                    >
                        <LeftCircleFilled
                            style={{
                                fontSize: "24px",
                                color: "white",
                                padding: "8px",
                            }}
                        />
                    </a>
                </Col>
                <Col span={20}>
                    <InputSearch
                        placeholder={t("header:search_personality")}
                        callback={handleInputSearch}
                        suffix={<SearchOutlined />}
                    />
                </Col>
            </Row>
            {overlay.results && (
                <Row
                    className="main-content"
                    style={{
                        background: "rgba(255,255,255,0.9)",
                        height: "100vh",
                        zIndex: 3,
                        position: "relative",
                        flexDirection: "column",
                    }}
                >
                    <SearchCard
                        title={t("search:personalityHeaderTitle")}
                        content={personalities}
                        searchName={searchName}
                        handleSearchClick={handleSearchClick}
                        type="personality"
                    />

                    <SearchCard
                        title={t("search:claimHeaderTitle")}
                        content={claims}
                        searchName={searchName}
                        handleSearchClick={handleSearchClick}
                        avatar={false}
                        type="claim"
                    />

                    <SearchCard
                        title={t("search:sentenceHeaderTitle")}
                        content={sentences}
                        searchName={searchName}
                        handleSearchClick={handleSearchClick}
                        avatar={false}
                        type="sentence"
                    />
                </Row>
            )}
        </OverlayDiv>
    );
};

export default SearchOverlay;
