import { Col, List } from "antd";
import React from "react";
import { useState } from "react";
import SourceApi from "../../api/sourceApi";

const ClaimSourceListItem = ({ source, index }) => {
    const { href } = source;
    const [linkValid, setLinkValid] = useState(null);

    const checkLink = async (url) => {
        
           const request = await SourceApi.checkSource(url);
           console.log("Resposta da API:");

           if (request?.status === 200) {
            setLinkValid(true);
            window.open(url, "_blank", "noopener noreferrer");
           } else {
            setLinkValid(false);
            alert(request?.message || "Link inválido");
           }

    }

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
