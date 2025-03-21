import React, { useContext } from "react";
import PopoverClick from "../../../Claim/Popover";
import EditorSourcePopoverContent from "./EditorSourcePopoverContent";
import { useCommands } from "@remirror/react";
import { VisualEditorContext } from "../../VisualEditorProvider";
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
    isArchive,
    children,
}: {
    node: ProsemirrorNode;
    source: any;
    setIsLoading: any;
    isArchive: boolean;
    children: React.ReactNode;
}) => {
    const command = useCommands();
    const { setEditorSources } = useContext(VisualEditorContext);
    const { props, href } = source;

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
        const { archived_snapshots } = await response.json();
        return archived_snapshots.closest.url;
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
            command.removeLink({ from: from - 1, to: to - 1 });
        } catch (error) {
            console.error("Error handling delete click:", error);
            removeEditorSource();
        } finally {
            setIsLoading(false);
        }
    };

    const removeEditorSource = () => {
        setEditorSources((sources) =>
            sources.filter(({ props: { id } }) => id !== props.id)
        );
    };

    return (
        <PopoverClick
            children={children}
            content={
                <EditorSourcePopoverContent
                    isArchive={isArchive}
                    handleArchiveClick={handleArchiveClick}
                    handleDeleteClick={handleDeleteClick}
                />
            }
        />
    );
};

export default EditorSourcePopover;
