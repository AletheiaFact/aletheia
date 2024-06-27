import React from "react";
import { uniqueId } from "remirror";
import { Col } from "antd";
import CardStyle from "./CardStyle";

interface EditorCardProps {
    label?: string;
    dataCy?: string;
    forwardRef?: any;
    extra?: React.ReactNode;
    span?: number;
    inputSize?: number;
}

const EditorCard = ({
    label,
    dataCy,
    forwardRef,
    extra,
    span = 24,
    inputSize = 100,
}: EditorCardProps) => {
    return (
        <CardStyle>
            <label>{label}</label>
            <Col span={span} className="card-container">
                <div
                    className="card-content"
                    data-cy={dataCy}
                    style={{ minHeight: inputSize }}
                >
                    <p style={{ overflowY: "inherit" }} ref={forwardRef} />
                </div>
            </Col>
            {extra}
        </CardStyle>
    );
};

export const getContentHtml = (dataAttributeName) => `
    <div ${dataAttributeName}="${uniqueId()}">
        <p></p>
    </div>`;

export default EditorCard;
