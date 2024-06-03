import { List } from "antd";
import React from "react";
import { EditorSourcesListStyle } from "./EditorSouceList.style";
import EditorSourceListItem from "./EditorSourceListItem";
import { ProsemirrorNode } from "remirror";
import { SourceType } from "../../../../types/Source";
import EditorAddSources from "./EditorAddSources";

const EditorSourcesList = ({
    node,
    sources,
}: {
    node: ProsemirrorNode;
    sources: SourceType[];
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
                        const {
                            props: { sup },
                        } = source;
                        if (typeof source === "object") {
                            return (
                                <EditorSourceListItem
                                    node={node}
                                    key={index}
                                    sup={sup || index + 1}
                                    source={source}
                                />
                            );
                        } else {
                            return <></>;
                        }
                    }}
                >
                    <EditorAddSources />
                </List>
            ) : (
                <EditorAddSources />
            )}
        </EditorSourcesListStyle>
    );
};

export default EditorSourcesList;
