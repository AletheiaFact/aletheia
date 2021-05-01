import React, { Component } from "react";
import { List, Button, Spin, Row } from "antd";
import { withTranslation } from "react-i18next";
class BaseList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            initLoading: true,
            query: {
                page: 1,
                pageSize: 10,
                fetchOnly: true,
                ...(props.query || {})
            },
            items: []
        };

        this.loadMore = this.loadMore.bind(this);
    }
    componentDidMount() {
        this.props.apiCall(this.state.query).then(items => {
            const query = this.state.query;
            this.setState({
                items: items.data,
                totalItems: items.total,
                query: { ...query, page: query.page + 1 },
                totalPages: items.totalPages,
                initLoading: false
            });
        });
    }

    loadMore() {
        this.setState({ loading: true });
        this.props.apiCall(this.state.query).then(items => {
            const query = this.state.query;
            this.setState({
                items: [...this.state.items, ...items.data],
                totalItems: items.total,
                query: { ...query, page: query.page + 1 },
                totalPages: items.totalPages,
                loading: false
            });
        });
    }
    render() {
        const { items, initLoading, loading, totalPages } = this.state;
        const { emptyFallback, t } = this.props;
        const loadMore =
            totalPages >= this.state.query.page ? (
                <div
                    style={{
                        textAlign: "center",
                        marginTop: 12,
                        height: 32,
                        lineHeight: "32px"
                    }}
                >
                    <Button onClick={this.loadMore}>
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
                            <Row
                                style={{
                                    textAlign: "center",
                                    display: "block"
                                }}
                            >
                                {t("list:totalItems", {
                                    total: this.state.totalItems
                                })}
                            </Row>
                        }
                        loadMore={loadMore}
                        loading={loading}
                        dataSource={this.state.items}
                        renderItem={item => {
                            return (
                                <List.Item>
                                    {this.props.renderItem(item)}
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
                            total: this.state.totalItems
                        })}
                    </Row>
                    {this.props.footer}
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
                return emptyFallback || null;
            }
        }
    }
}

export default withTranslation()(BaseList);
