import { Button, Col, List, Row, Spin } from "antd";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";

import SortByButton from "./SortByButton";

const BaseList = ({
    apiCall,
    renderItem,
    filter = {}, // replaced 'query' parameter
    emptyFallback = <></>,
    style = {},
    footer = <></>,
    title = "",
    grid = null,
}) => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [items, setItems] = useState([]);
    const [sortByOrder] = useState("asc");
    const [execLoadMore, setExecLoadMore] = useState<boolean>(true);

    const [query, setQuery] = useState({
        page: 1,
        pageSize: 10,
        fetchOnly: true,
        order: sortByOrder,
        ...filter,
    });

    useEffect(() => {
        apiCall(query).then((newItems) => {
            setInitLoading(false);
            setLoading(false);
            setTotalPages(newItems.totalPages);
            setTotalItems(newItems.total);
            setItems(
                execLoadMore ? [...items, ...newItems.data] : newItems.data
            );
        });
    }, [query, apiCall]);

    useEffect(() => {
        setLoading(true);
        setExecLoadMore(false);

        setQuery({
            page: 1,
            pageSize: 10,
            fetchOnly: true,
            order: sortByOrder,
            ...filter,
        });
    }, [filter]);

    const loadMoreData = () => {
        if (execLoadMore !== true) {
            setExecLoadMore(true);
        }
        setLoading(true);
        setQuery({
            ...query,
            page: query.page + 1,
        });
    };

    const refreshListItems = (sortBy) => {
        const newQuery = {
            order: sortBy,
        };

        if (execLoadMore !== false) {
            setExecLoadMore(false);
        }
        setLoading(true);
        setQuery({
            ...query,
            ...newQuery,
            page: 1,
        });
    };

    const loadMoreButton =
        totalPages > query.page ? (
            <div
                style={{
                    textAlign: "center",
                    marginTop: 12,
                    height: 32,
                    lineHeight: "32px",
                }}
            >
                <Button onClick={loadMoreData}>
                    {t("list:loadMoreButton")}
                </Button>
            </div>
        ) : null;

    if (items && Array.isArray(items) && (items.length > 0 || !emptyFallback)) {
        return (
            <>
                <List
                    itemLayout="horizontal"
                    grid={grid}
                    header={
                        <Row align="middle" justify="space-between">
                            <Col>
                                <Row>
                                    <span
                                        style={{
                                            fontSize: 24,
                                        }}
                                    >
                                        {title}
                                    </span>
                                </Row>

                                {t("list:totalItems", {
                                    total: totalItems,
                                })}
                            </Col>
                            <Col>
                                <SortByButton
                                    refreshListItems={refreshListItems}
                                />
                            </Col>
                        </Row>
                    }
                    style={style || {}}
                    loadMore={loadMoreButton}
                    loading={loading}
                    dataSource={items}
                    renderItem={(item) => {
                        return <List.Item>{renderItem(item)}</List.Item>;
                    }}
                />
                <Row
                    style={{
                        textAlign: "center",
                        display: "block",
                        marginBottom: "20px",
                    }}
                >
                    {t("list:totalItems", {
                        total: totalItems,
                    })}
                </Row>
                {footer}
            </>
        );
    } else {
        if (initLoading) {
            return (
                <Spin
                    tip={t("global:loading")}
                    style={{
                        textAlign: "center",
                        position: "absolute",
                        top: "50%",
                        left: "calc(50% - 40px)",
                    }}
                ></Spin>
            );
        } else {
            return emptyFallback;
        }
    }
};

export default BaseList;
