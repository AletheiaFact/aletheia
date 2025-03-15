import { Grid } from "@mui/material";
import React from "react";
import { EditorSourcesListStyle } from "./EditorSouceList.style";
import EditorSourceListItem from "./EditorSourceListItem";
import { ProsemirrorNode } from "remirror";
import { SourceType } from "../../../../types/Source";
import EditorAddSources from "./EditorAddSources";
import { Node } from "@remirror/pm/model";

const EditorSourcesList = ({
    node,
    sources,
    nodeFromJSON,
}: {
    node: ProsemirrorNode;
    sources: SourceType[];
    nodeFromJSON: (json: any) => Node;
}) => {
    return (
        <EditorSourcesListStyle>
            {sources.length > 0 ? (
                <>
                    {sources.map((source, index) => (
                        <Grid container
                            direction="row"
                            position="relative"
                            key={source._id}
                            xs={12}
                            sm={6}
                            lg={4}
                        >
                            <EditorSourceListItem
                                node={node}
                                key={source._id}
                                sup={index + 1}
                                source={source}
                            />
                        </Grid>
                    ))
                    }
                    <EditorAddSources nodeFromJSON={nodeFromJSON} doc={node} />
                </>
            ) : (
                <EditorAddSources nodeFromJSON={nodeFromJSON} doc={node} />
            )}
        </EditorSourcesListStyle>
    );
};

export default EditorSourcesList;
