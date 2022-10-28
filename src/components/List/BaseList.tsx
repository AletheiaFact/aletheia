import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, List, Row } from "antd";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import colors from "../../styles/colors";
import Loading from "../Loading";
import SkeletonList from "../Skeleton/SkeletonList";

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
    showDividers = true,
    bluePrimary = false,
    skeleton = null,
}) => {
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [items, setItems] = useState([]);
    const [sortByOrder] = useState("asc");
    const [execLoadMore, setExecLoadMore] = useState<boolean>(true);

    const loadingIcon = (
        <LoadingOutlined
            spin
            style={{ fontSize: 48, color: colors.bluePrimary }}
        />
    );
    const loadingProps = {
        spinning: true,
        indicator: loadingIcon,
    };

    const [query, setQuery] = useState({
        page: 1,
        pageSize: 10,
        fetchOnly: true,
        order: sortByOrder,
        ...filter,
    });

    // TODO: use TimerCallback to refresh the list

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
                    split={showDividers}
                    header={
                        <Row align="middle" justify="space-between">
                            <Col>
                                <h2
                                    style={{
                                        fontSize: "24px",
                                        lineHeight: "32px",
                                        color: bluePrimary
                                            ? colors.bluePrimary
                                            : colors.blackPrimary,
                                        marginBottom: 0,
                                    }}
                                >
                                    {title}
                                </h2>

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
                    loading={loading && loadingProps}
                    dataSource={items}
                    renderItem={(item) => {
                        return <List.Item>{renderItem(item)}</List.Item>;
                    }}
                />
                <Row
                    style={{
                        textAlign: "center",
                        display: "block",
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: colors.blackSecondary,
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
                <>
                    {skeleton ? (
                        <SkeletonList listItem={skeleton} repeat={4} />
                    ) : (
                        <Loading />
                    )}
                </>
            );
        } else {
            return emptyFallback;
        }
    }
};

export default BaseList;
