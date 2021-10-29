import React, { Component } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Col, Row } from "antd";
import { CloseOutlined, RightOutlined } from "@ant-design/icons";
import InputSearch from "./Form/InputSearch";
import { useTranslation } from "next-i18next";
import api from "../api/personality";
import { useRouter } from "next/router";
import styled from "styled-components";

const OverlayDiv = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;

    .ant-input-search.ant-input-affix-wrapper-lg {
        padding: 9px 14px;
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
    const { personalities, page, pageSize, searchName } = useSelector(
        (state) => {
            return {
                personalities: state?.search?.searchResults || [],
                page: state?.search?.searchCurPage || 1,
                pageSize: state?.search?.searchPageSize || 10,
                searchName: state?.search?.searchInput || null
            };
        }
    );
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const router = useRouter();

    const handleInputSearch = (name) => {
        dispatch({
            type: "SET_SEARCH_NAME",
            searchName: name
        });

        api.getPersonalities({
            personalities,
            page,
            pageSize,
            searchName: name
        }, dispatch);
    }
    return (
        <OverlayDiv>
            <Row className="aletheia-header"
                 style={{
                     backgroundColor: "#2d77a3",
                     boxShadow: "0 2px 2px rgba(0, 0, 0, 0.1)",
                     height: "70px",
                     padding: "0 15px",
                     alignItems: "center",
                     justifyContent: "center",
                 }}
            >
                <Col span={20}>
                    <InputSearch
                        placeholder={t("header:search_personality")}
                        callback={handleInputSearch}
                    />
                </Col>
                <Col
                    span={4}
                    style={{
                        textAlign: "center"
                    }}
                >
                    <a
                        onClick={() => {
                            dispatch({
                                type: "ENABLE_SEARCH_OVERLAY",
                                overlay: false
                            });
                        }}
                    >
                        <CloseOutlined
                            style={{
                                fontSize: "16px",
                                color: "white",
                                padding: "8px"
                            }}
                        />
                    </a>
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
                        flexDirection: "column"
                    }}
                >
                    {personalities &&
                    Array.isArray(personalities) &&
                    personalities.length > 0 && (
                        <>
                            {personalities.map(
                                (p, i) =>
                                    p && (
                                        <Row
                                            key={i}
                                            style={{
                                                background: "#fff",
                                                padding: "10px 10%",
                                                boxShadow:
                                                    "0 2px 2px rgba(0, 0, 0, 0.1)",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => {
                                                dispatch({
                                                    type:
                                                        "ENABLE_SEARCH_OVERLAY",
                                                    overlay: false
                                                });
                                                router.push(
                                                    `/personality/${p.slug}`
                                                );
                                            }}
                                        >
                                            <Col span={4}>
                                                <Avatar
                                                    size={30}
                                                    src={p.image}
                                                />
                                            </Col>
                                            <Col span={18}>
                                                <span
                                                    level={4}
                                                    style={{
                                                        marginBottom: 0,
                                                        textSize: "14px"
                                                    }}
                                                >
                                                    {p.name}
                                                </span>
                                            </Col>
                                            <Col span={2}>
                                                <RightOutlined />
                                            </Col>
                                        </Row>
                                    )
                            )}
                        </>
                    )}
                </Row>
            )}
        </OverlayDiv>
    );
}


export default SearchOverlay;
