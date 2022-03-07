import React, { useState, useEffect } from "react";
import { List, Button, Spin, Row, Col } from "antd";
import { useTranslation } from "next-i18next";
import SortBySelect from "./SortBySelect";

const BaseList = ({
    apiCall,
    renderItem,
    filter = {}, // replaced 'query' parameter
    emptyFallback = <></>,
    style = {},
    footer = <></>,
    title = ''
}) => {
    const { t } = useTranslation();

    const [ loading, setLoading ] = useState(false)
    const [ initLoading, setInitLoading ] = useState(true)
    const [ totalPages, setTotalPages ] = useState(0)
    const [ totalItems, setTotalItems ] = useState(0)
    const [ items, setItems ] = useState([])
    const [ sortBy, setSortBy ] = useState('asc')
    const [ execLoadMore, setExecLoadMore ] = useState<boolean>(true)

    const [ query, setQuery ] = useState({
        page: 1,
        pageSize: 10,
        fetchOnly: true,
        order: sortBy,
        ...filter
    })

    useEffect(() => {
        apiCall(query).then(newItems => {
            setInitLoading(false)
            setLoading(false)
            setTotalPages(newItems.totalPages)
            setTotalItems(newItems.total)
            setItems(execLoadMore ? [...items, ...newItems.data] : newItems.data)
        });
    }, [query, apiCall]);

    const loadMoreData = () => {
        if (execLoadMore !== true) {
            setExecLoadMore(true)
        }
        setLoading(true);
        setQuery({
            ...query,
            page: query.page + 1
        })
    }

    const refreshListItems = (newQuery) => {
        if (execLoadMore !== false) {
            setExecLoadMore(false)
        }
        setLoading(true);
        setQuery({
            ...query,
            ...newQuery,
            page: 1
        })
    }

    const loadMoreButton =
        totalPages > query.page ? (
            <div
                style={{
                    textAlign: "center",
                    marginTop: 12,
                    height: 32,
                    lineHeight: "32px"
                }}
            >
                <Button onClick={loadMoreData}>
                    {t("list:loadMoreButton")}
                </Button>
            </div>
        ) : null;

    if (
        items &&
        Array.isArray(items) &&
        (items.length > 0 || !emptyFallback)
    ) {
        return (
            <>
                <List
                    itemLayout="horizontal"
                    header={
                        <Row style={{width: "100%"}}>
                            <Row
                                style={{
                                    fontSize: 18,
                                    width: "100%"
                                }}
                            >
                                <span>{title}</span>
                            </Row>
                            <Row
                                style={{
                                    width: "100%"
                                }}
                            >
                                <Col>
                                {t("list:totalItems", {
                                    total: totalItems
                                })}
                                </Col>
                                <Col>
                                    <SortBySelect onSelect={(sortBy) => refreshListItems({ order: sortBy })} />
                                </Col>
                            </Row>
                        </Row>
                    }
                    style={style || {}}
                    loadMore={loadMoreButton}
                    loading={loading}
                    dataSource={items}
                    renderItem={item => {
                        return (
                            <List.Item>
                                {renderItem(item)}
                            </List.Item>
                        );
                    }}
                />
                <Row
                    style={{
                        textAlign: "center",
                        display: "block",
                        marginBottom: "20px"
                    }}
                >
                    {t("list:totalItems", {
                        total: totalItems
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
                        left: "calc(50% - 40px)"
                    }}
                ></Spin>
            );
        } else {
            return emptyFallback;
        }
    }
}

export default BaseList;
