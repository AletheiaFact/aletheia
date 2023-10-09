import { Col, Spin } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditorSourcePopover from "./EditorSourcePopover";
import colors from "../../../../styles/colors";

const WEB_ARCHIVE_POSITION_OFFSET = 42;

const EditorSourceListItem = ({ node, sup, source }) => {
    const { href } = source;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isArchive, setIsArchive] = useState<boolean>(false);

    useEffect(() => {
        setIsArchive(href.includes("http://web.archive.org/web/"));
        return () => {};
    }, [href]);

    const title = useMemo(() => {
        const url = isArchive ? href.slice(WEB_ARCHIVE_POSITION_OFFSET) : href;
        const domainWithoutProtocol = url.replace(
            /^(https?:\/\/)?(www\.)?/,
            ""
        );
        const domainParts = domainWithoutProtocol.split(".");
        return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
    }, [href, isArchive]);

    return (
        <Spin
            spinning={isLoading}
            indicator={
                <LoadingOutlined style={{ color: colors.bluePrimary }} />
            }
        >
            <Col className="source-card">
                <Col className="source-card-header">
                    <h3>
                        {sup}. {title}
                    </h3>
                    <EditorSourcePopover
                        node={node}
                        source={source}
                        setIsLoading={setIsLoading}
                    >
                        <MoreVertIcon style={{ cursor: "pointer" }} />
                    </EditorSourcePopover>
                </Col>
                <Col className="source-card-content">
                    <a href={href} target="_blank" rel="noopener noreferrer">
                        {href}
                    </a>
                </Col>
            </Col>
        </Spin>
    );
};

export default EditorSourceListItem;
