import React, { useContext } from "react";
import { uniqueId } from "remirror";
import { Grid, Typography } from "@mui/material";
import CardStyle from "./CardStyle";
import { VisualEditorContext } from "../VisualEditorProvider";

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
    const { editorConfiguration } = useContext(VisualEditorContext);
    const isReadonly = editorConfiguration?.readonly;
    
    return (
        <CardStyle container>
            <Typography variant="subtitle1" component="span" contentEditable={false} suppressContentEditableWarning>
                {label}
            </Typography>
            <Grid item xs={span} className="card-container">
                <div
                    className="card-content"
                    data-cy={dataCy}
                    style={{ 
                        minHeight: inputSize,
                        backgroundColor: isReadonly ? 'rgba(0, 0, 0, 0.02)' : undefined,
                        cursor: isReadonly ? 'not-allowed' : undefined
                    }}
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
