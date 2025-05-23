import React, { useEffect, useMemo, useState } from "react";
import { CircularProgress, Grid } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditorSourcePopover from "./EditorSourcePopover";
import colors from "../../../../styles/colors";
import { NameSpaceEnum } from "../../../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../../atoms/namespace";
import { ProsemirrorNode } from "remirror";
import { SourceType } from "../../../../types/Source";

const WEB_ARCHIVE_POSITION_OFFSET: number = 42;

interface EditorSouceListProps {
    node: ProsemirrorNode;
    sup: number;
    source: SourceType;
}

const EditorSourceListItem = ({ node, sup, source }: EditorSouceListProps) => {
    const [nameSpace] = useAtom(currentNameSpace);
    const { href } = source;
    const [isLoading, setIsLoading] = useState(false);
    const [isArchive, setIsArchive] = useState(false);

    useEffect(() => {
        function updateIsArchive(url) {
            try {
                const parsedUrl = new URL(url);
                return parsedUrl.hostname === "web.archive.org";
            } catch (error) {
                console.error("Invalid URL:", error);
                return false;
            }
        }

        setIsArchive(updateIsArchive(href));
    }, [href]);

    const title = useMemo(() => {
        const url = isArchive ? href.slice(WEB_ARCHIVE_POSITION_OFFSET) : href;
        const domainWithoutProtocol = url.replace(
            /^(https?:\/\/)?(www\.)?/,
            ""
        );
        const domainParts = domainWithoutProtocol.split(".");
        return domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);
    }, [href, isArchive]);

    return (
        <>
            <Grid item style={{ opacity: isLoading && "0.4" }} className="source-card">
                <Grid item className="source-card-header">
                    <h3>
                        {sup}. {title}
                    </h3>
                    <EditorSourcePopover
                        node={node}
                        source={source}
                        setIsLoading={setIsLoading}
                        isArchive={isArchive}
                    >
                        <MoreVertIcon style={{ cursor: "pointer" }} />
                    </EditorSourcePopover>
                </Grid>
                <Grid item className="source-card-content">
                    <a href={href} target="_blank" rel="noopener noreferrer">
                        {href}
                    </a>
                </Grid>
            </Grid>
            {isLoading &&
                <Grid item
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <CircularProgress
                        size={35}
                        style={{
                            color:
                                nameSpace === NameSpaceEnum.Main
                                    ? colors.primary
                                    : colors.secondary,
                        }}
                    />
                </Grid >
            }
        </>
    );
};

export default EditorSourceListItem;
