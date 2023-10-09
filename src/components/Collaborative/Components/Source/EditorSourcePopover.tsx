import React, { useContext, useEffect, useState } from "react";
import { Popover } from "antd";
import EditorSourcePopoverContent from "./EditorSourcePopoverContent";
import { useCommands } from "@remirror/react";
import { CollaborativeEditorContext } from "../../CollaborativeEditorProvider";
import { ProsemirrorNode } from "remirror";

/**
 * For some reason, we need to add an offset to the node position in order to
 * get the proper range
 */
const POSITION_OFFSET = 2;

const EditorSourcePopover = ({
    node,
    source,
    setIsLoading,
    children,
}: {
    node: ProsemirrorNode;
    source: any;
    setIsLoading: any;
    children: React.ReactNode;
}) => {
    const command = useCommands();
    const { setEditorSources } = useContext(CollaborativeEditorContext);
    const { props, href } = source;
    const [isArchive, setIsArchive] = useState<boolean>(false);

    useEffect(() => {
        const url = new URL(href);
        if (url.hostname.includes("web.archive.org")) {
            setIsArchive(true);
        }
        return () => {};
    }, [href]);

    function findMarkPositions(
        doc: ProsemirrorNode,
        targetValue: string
    ): number[] {
        function walkProseMirrorTree(
            node: ProsemirrorNode,
            globalPos,
            parent = null,
            index = null
        ) {
            if (node.isText) {
                const { marks } = node;
                const hasMark = !!marks.filter(
                    (mark) => mark.attrs.id === targetValue
                ).length;
                const from = globalPos + POSITION_OFFSET;
                const to = from + node.nodeSize;
                return hasMark ? [from, to] : null;
            }

            let foundNodePosition = null;
            node.descendants((...params) => {
                params[1] += globalPos;
                if (!foundNodePosition) {
                    foundNodePosition = walkProseMirrorTree(...params);
                }
            });

            return foundNodePosition;
        }

        return walkProseMirrorTree(doc, 0);
    }

    const handleArchiveClick = async () => {
        setIsLoading(true);
        try {
            const [from, to] = findMarkPositions(node, props?.id);
            const archiveHref = await getArchiveHref();
            command.updateLink(
                { href: archiveHref, id: props?.id },
                { from, to }
            );
            updateEditorSources(archiveHref);
        } catch (error) {
            console.error("Error handling archive click:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getArchiveHref = async () => {
        const response = await fetch(
            `https://archive.org/wayback/available?url=${href}`
        );
        const teste = await response.json();
        // const { archived_snapshots } = await response.json();
        console.log("teste", teste);
        return teste.archived_snapshots.closest.url;
    };

    const updateEditorSources = (archiveHref) => {
        setEditorSources((sources) => {
            return sources.map((editorSource) =>
                source.props.id === editorSource.props.id
                    ? { ...editorSource, href: archiveHref }
                    : editorSource
            );
        });
    };

    const handleDeleteClick = async () => {
        setIsLoading(true);
        try {
            const [from, to] = findMarkPositions(node, props?.id);
            removeEditorSource();
            command.removeLink({ from, to });
        } catch (error) {
            console.error("Error handling delete click:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeEditorSource = () => {
        setEditorSources((sources) => {
            return sources.filter((src) => src.href !== href);
        });
    };

    return (
        <Popover
            trigger="click"
            placement="bottom"
            overlayInnerStyle={{ padding: 0 }}
            content={
                <EditorSourcePopoverContent
                    isArchive={isArchive}
                    handleArchiveClick={handleArchiveClick}
                    handleDeleteClick={handleDeleteClick}
                />
            }
        >
            {children}
        </Popover>
    );
};

export default EditorSourcePopover;
