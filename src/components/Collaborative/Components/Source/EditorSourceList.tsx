import { List } from "antd";

import React from "react";
import { useTranslation } from "next-i18next";
import { EditorSourcesListStyle } from "./EditorSouceList.style";
import EditorSourceListItem from "./EditorSourceListItem";
import { ProsemirrorNode } from "remirror";

const EditorSourcesList = ({
    node,
    sources,
}: {
    node: ProsemirrorNode;
    sources: any[];
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
                    renderItem={(source, index) => (
                        <EditorSourceListItem
                            node={node}
                            key={index}
                            sup={index + 1}
                            source={source}
                        />
                    )}
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
