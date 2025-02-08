import { CircularProgress, Button, Grid, List, ListItem } from "@mui/material";
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
            <Button
                variant="outlined"
                onClick={loadMoreData}
                style={{
                    color: colors.primary,
                    fontSize: 14
                }}
            >
                {t("list:loadMoreButton")}
            </Button>
        ) : null;

    if (items && Array.isArray(items) && (items.length > 0 || !emptyFallback)) {
        return (
            <>
                <Grid container
                    style={{
                        alignContent: "middle",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom: "1px solid #eee"
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
                        <p
                            style={{
                                fontSize: "14px",
                                marginBottom: 0,
                            }}
                        >
                            {t("list:totalItems", {
                                total: totalItems,
                            })}
                        </p>
                    </Grid>
                    <Grid item>
                        <SortByButton
                            refreshListItems={refreshListItems}
                        />
                    </Grid>
                </Grid>
                <List
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        padding: 0,
                    }}
                >
                    {loading && loadingProps ? (
                        <Grid container style={{ display: "flex", justifyContent: "center", padding: 2 }}>
                            {loadingIcon}
                        </Grid>
                    ) : (
                        items.map((item) => (
                            <Grid container item {...grid}>
                                <ListItem key={item} style={{ borderBottom: showDividers ? "1px solid #eee" : "none", padding: "0 10px", ...style }}>
                                    {renderItem(item)}
                                </ListItem>
                            </Grid>
                        ))
                    )}
                    {loadMoreButton && (
                        <Grid item style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            {loadMoreButton}
                        </Grid>
                    )}
                </List >
                <Grid container
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
