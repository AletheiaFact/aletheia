import { Col, List } from "antd";

import React from "react";

const SourceListItem = ({ source, index }) => {
    return (
        <Col className="source">
            {typeof source === "object" ? (
                <List.Item id={source.ref}>
                    {index}.{" "}
                    <a
                        href={source.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {source.link}
                    </a>
                </List.Item>
            ) : (
                <List.Item id={source}>
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
