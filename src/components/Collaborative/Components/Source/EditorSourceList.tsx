import { List } from "antd";

import React from "react";
import { useTranslation } from "next-i18next";
import { EditorSourcesListStyle } from "./EditorSouceList.style";
import EditorSourceListItem from "./EditorSourceListItem";
import { ProsemirrorNode } from "remirror";
import { SourceType } from "../../../../types/Source";

const EditorSourcesList = ({
    node,
    sources,
}: {
    node: ProsemirrorNode;
    sources: SourceType[];
}) => {
    const { t } = useTranslation();

    return (
        <EditorSourcesListStyle>
            {sources.length > 0 ? (
                <List
                    dataSource={sources}
                    grid={{
                        xs: 1,
                        sm: 2,
                        md: 2,
                        lg: 3,
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
                />
            ) : (
                <div className="empty-sources-container">
                    <p className="empty-text">
                        {t("sourceForm:editorEmptySources")}
                    </p>
                </div>
            )}
        </EditorSourcesListStyle>
    );
};

export default EditorSourcesList;
