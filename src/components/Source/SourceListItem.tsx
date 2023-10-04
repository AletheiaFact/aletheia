import { Col, List } from "antd";

import React from "react";

const SourceListItem = ({ source, index }) => {
    const { href, sup, targetText } = source;

    return (
        <Col className="source">
            {typeof source === "object" ? (
                <List.Item id={targetText}>
                    <span style={{ marginRight: 4 }}>{sup}.</span>
                    <a href={href} target="_blank" rel="noopener noreferrer">
                        {href}
                    </a>
                </List.Item>
            ) : (
                <List.Item id={source}>
                    {/* TODO: Remove this ternary when source migration is done */}
                    {index}.{" "}
                    <a href={source} target="_blank" rel="noopener noreferrer">
                        {source}
                    </a>
                </List.Item>
            )}
        </Col>
    );
};

export default SourceListItem;
