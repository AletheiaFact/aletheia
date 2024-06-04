import { List } from "antd";
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
                <List
                    dataSource={sources}
                    grid={{
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 2,
                        xl: 3,
                        xxl: 3,
                    }}
                    renderItem={(source, index) => {
                        if (typeof source === "object") {
                            return (
                                <EditorSourceListItem
                                    node={node}
                                    key={index}
                                    sup={index + 1}
                                    source={source}
                                />
                            );
                        } else {
                            return <></>;
                        }
                    }}
                >
                    <EditorAddSources nodeFromJSON={nodeFromJSON} doc={node} />
                </List>
            ) : (
                <EditorAddSources nodeFromJSON={nodeFromJSON} doc={node} />
            )}
        </EditorSourcesListStyle>
    );
};

export default EditorSourcesList;
