import { CircularProgress, Button, Grid } from "@mui/material";
import { List } from "antd";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import colors from "../../styles/colors";
import Loading from "../Loading";
import SkeletonList from "../Skeleton/SkeletonList";

import SortByButton from "./SortByButton";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

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
    const [nameSpace] = useAtom(currentNameSpace);

    const loadingIcon = (
        <CircularProgress
            style={{
                fontSize: 48,
                color:
                    nameSpace === NameSpaceEnum.Main
                        ? colors.primary
                        : colors.secondary,
            }}
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
    });

    // TODO: use TimerCallback to refresh the list

    useEffect(() => {
        setLoading(true);
        setExecLoadMore(false);
        apiCall({ ...query, ...filter }).then((newItems) => {
            setInitLoading(false);
            setLoading(false);
            setTotalPages(newItems.totalPages);
            setTotalItems(newItems.total);
            setItems(
                execLoadMore ? [...items, ...newItems.data] : newItems.data
            );
        });
    }, [query, filter]);

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
                        <Grid
                            container
                            style={{
                                alignContent: "middle",
                                justifyContent: "space-between",
                            }}
                        >
                            <Grid item>
                                <h2
                                    style={{
                                        fontSize: "24px",
                                        lineHeight: "32px",
                                        color: bluePrimary
                                            ? colors.primary
                                            : colors.black,
                                        marginBottom: 0,
                                    }}
                                >
                                    {title}
                                </h2>

                                {t("list:totalItems", {
                                    total: totalItems,
                                })}
                            </Grid>
                            <Grid item>
                                <SortByButton
                                    refreshListItems={refreshListItems}
                                />
                            </Grid>
                        </Grid>
                    }
                    style={style || {}}
                    loadMore={loadMoreButton}
                    loading={loading && loadingProps}
                    dataSource={items}
                    renderItem={(item) => {
                        return <List.Item>{renderItem(item)}</List.Item>;
                    }}
                />
                <Grid
                    container
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
                </Grid>
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
