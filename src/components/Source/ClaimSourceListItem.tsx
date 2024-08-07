import { Col, List } from "antd";

import React from "react";

const ClaimSourceListItem = ({ source, index }) => {
    const { href } = source;

    return (
        <Col className="source">
            {typeof source === "object" ? (
                <List.Item id={source?.props?.targetText || source?.targetText}>
                    <span style={{ marginRight: 4 }}>
                        {source?.props?.sup || source?.sup || index}.
                    </span>
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

export default ClaimSourceListItem;
