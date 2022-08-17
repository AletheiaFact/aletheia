import { LeftCircleFilled, SearchOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import api from "../api/personality";
import { useAppSelector } from "../store/store";
import { ActionTypes } from "../store/types";
import colors from "../styles/colors";
import AletheiaAvatar from "./AletheiaAvatar";
import InputSearch from "./Form/InputSearch";
import SearchResult from "./SearchResult";

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
        color: #515151;
    }

    @media (min-width: 768px) {
        .aletheia-header {
            padding: 0 30%;
        }
    }
`;

const SearchOverlay = ({ overlay }) => {
    const { personalities, page, pageSize, searchName } = useAppSelector(
        (state) => {
            return {
                personalities: state?.search?.searchResults || [],
                page: state?.search?.searchCurPage || 1,
                pageSize: state?.search?.searchPageSize || 10,
                searchName: state?.search?.searchInput || null,
            };
        }
    );
    const handleSearchClick = (slug) => {
        dispatch({
            type: ActionTypes.ENABLE_SEARCH_OVERLAY,
            overlay: false,
        });
        router.push(`/personality/${slug}`);
    };

    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const router = useRouter();

    const handleInputSearch = (name) => {
        dispatch({
            type: ActionTypes.SET_SEARCH_NAME,
            searchName: name,
        });

        api.getPersonalities(
            {
                personalities,
                page,
                pageSize,
                searchName: name,
                i18n,
            },
            dispatch
        );
    };

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
                    {personalities &&
                        Array.isArray(personalities) &&
                        personalities.length > 0 && (
                            <>
                                {personalities.map(
                                    (p, i) =>
                                        p && (
                                            <SearchResult
                                                key={i}
                                                handleOnClick={() =>
                                                    handleSearchClick(p.slug)
                                                }
                                                avatar={
                                                    <AletheiaAvatar
                                                        size={30}
                                                        src={p.avatar}
                                                        alt={t(
                                                            "seo:personalityImageAlt",
                                                            {
                                                                name: p.name,
                                                            }
                                                        )}
                                                    />
                                                }
                                                name={p.name}
                                                searchName={searchName}
                                            />
                                        )
                                )}
                            </>
                        )}
                </Row>
            )}
        </OverlayDiv>
    );
};

export default SearchOverlay;
