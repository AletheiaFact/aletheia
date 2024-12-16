import React from "react";
import { uniqueId } from "remirror";
import { Grid } from "@mui/material";
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
    span = 12,
    inputSize = 100,
}: EditorCardProps) => {
    return (
        <CardStyle>
            <label>{label}</label>
            <Grid container xs={span} className="card-container">
                <div
                    className="card-content"
                    data-cy={dataCy}
                    style={{ minHeight: inputSize }}
                >
                    <p style={{ overflowY: "inherit" }} ref={forwardRef} />
                </div>
            </Grid>
            {extra}
        </CardStyle>
    );
};

export const getContentHtml = (dataAttributeName) => `
    <div ${dataAttributeName}="${uniqueId()}">
        <p></p>
    </div>`;

export default EditorCard;
