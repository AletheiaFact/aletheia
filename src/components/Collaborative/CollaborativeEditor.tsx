import React, { useCallback, useEffect, useMemo } from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import { Remirror, useHelpers, useRemirror } from "@remirror/react";
import {
    AnnotationExtension,
    PlaceholderExtension,
    YjsExtension,
    LinkExtension,
} from "remirror/extensions";
import FloatingLinkToolbar from "./LinkToolBar/FloatingLinkToolbar";
import colors from "../../styles/colors";
import { useAppSelector } from "../../store/store";
import CollaborativeEditorStyle from "./CollaborativeEditor.style";

const createWebsocketConnection = (hash: string) => {
    const ydoc = new Y.Doc();
    return new WebsocketProvider("ws://localhost:1234", hash, ydoc);
};

/**
 * modifies reference to useful properties those are easier to manipulate
 * @param state remirror state
 * @param editorRef reference to editor
 */
const Editor = ({ state, editorRef }: { state: any; editorRef: any }) => {
    const { getJSON, getHTML } = useHelpers();

    useEffect(() => {
        editorRef.current = {
            JSON: getJSON(),
            html: getHTML(),
        };

        return () => {};
    }, [state, getJSON, getHTML, editorRef]);

    return <></>;
};

interface CollaborativeEditorProps {
    placeholder: string;
    onChange: (changeProps: any) => void;
    editorRef: any;
    error: string;
}

const CollaborativeEditor = ({
    placeholder,
    onChange,
    editorRef,
    error,
}: CollaborativeEditorProps) => {
    const { data_hash } = useAppSelector((state) => ({
        data_hash: state?.selectedDataHash,
    }));

    const url = window.location.href;
    const hashIndex = url.indexOf("#");
    const startIndex = url.indexOf("sentence/") + "sentence/".length;
    const endIndex = hashIndex !== -1 ? hashIndex : undefined;
    const url_hash = url.slice(startIndex, endIndex);

    const provider = useMemo(
        () => createWebsocketConnection(data_hash || url_hash),
        [data_hash, url_hash]
    );

    function createExtensions() {
        return [
            new AnnotationExtension(),
            new PlaceholderExtension({ placeholder }),
            new LinkExtension({ autoLink: true }),
            new YjsExtension({ getProvider: () => provider }),
        ];
    }

    const { manager, state, setState } = useRemirror({
        extensions: createExtensions,
        core: { excludeExtensions: ["history"] },
        stringHandler: "html",
    });

    return (
        <>
            <CollaborativeEditorStyle ref={editorRef}>
                <Remirror
                    manager={manager}
                    initialContent={state}
                    autoFocus
                    autoRender="end"
                    onChange={useCallback(
                        (changeProps) => {
                            onChange(changeProps);
                            setState(changeProps.state);
                        },
                        [setState, onChange]
                    )}
                >
                    <FloatingLinkToolbar />
                    <Editor state={state} editorRef={editorRef} />
                </Remirror>
            </CollaborativeEditorStyle>
            {error && <span style={{ color: colors.redText }}>{error}</span>}
        </>
    );
};

export default CollaborativeEditor;
