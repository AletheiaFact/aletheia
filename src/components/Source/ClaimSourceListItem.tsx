import { Col, List, message } from "antd";
import React from "react";
import { useState } from "react";
import SourceApi from "../../api/sourceApi";
import { useTranslation } from "next-i18next";

const ClaimSourceListItem = ({ source, index }) => {
    const { href } = source;
    const [linkValid, setLinkValid] = useState(null);
    const { t } = useTranslation();

    const checkLink = async (url) => {
        
        try {
            const request = await SourceApi.checkSource(url, t);

            if (request?.status === 200) {
                setLinkValid(true);
                window.open(url, "_blank", "noopener noreferrer");
            } else {
                setLinkValid(false);
                message.error(t("sources:sourceInvalid"));
            }
        } catch (error) {
            setLinkValid(false);
            message.error(t("sources:sourceInvalid"));
        }
    };

    return (
        <Col className="source">
            {typeof source === "object" ? (
                <List.Item id={source?.props?.targetText || source?.targetText}>
                    <span style={{ marginRight: 4 }}>
                        {source?.props?.sup || source?.sup || index}.
                    </span>
                    <a href={"#"}
                    onClick={(e) => { 
                        e.preventDefault();
                        checkLink(href);
                    }}>
                        {href}
                    </a>
                </List.Item>
            ) : (
                <List.Item id={source}>
                    {/* TODO: Remove this ternary when source migration is done */}
                    {index}.{" "}
                    <a href={"#"} onClick={(e) => {
                        e.preventDefault();
                        checkLink(source);
                    }}>
                        {source}
                    </a>
                </List.Item>
            )}
        </Col>
    );
};

export default ClaimSourceListItem;
