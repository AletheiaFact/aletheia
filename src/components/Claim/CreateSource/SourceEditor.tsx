import React, { useCallback } from "react";
import {
    PlaceholderExtension,
    TrailingNodeExtension,
} from "remirror/extensions";
import { Remirror, useRemirror } from "@remirror/react";
import SummaryExtension from "../../Collaborative/Form/SummaryExtesion";
import SourceExtension from "../../Collaborative/Form/SourceExtesion";
import ProsemirrorEditorStyle from "../../Collaborative/ProsemirrorEditor.style";
import SourceEditorButton from "./SourceEditorButton";

const SourceEditor = ({ onContentChange }) => {
    function createExtensions() {
        return [
            new PlaceholderExtension({ placeholder: "" }),
            new SummaryExtension({ disableExtraAttributes: true }),
            new SourceExtension({ disableExtraAttributes: true }),
            new TrailingNodeExtension(),
        ];
    }

    const { manager, state, setState } = useRemirror({
        extensions: createExtensions,
        core: { excludeExtensions: ["history"] },
        stringHandler: "html",
        content: {
            content: [
                {
                    type: "source",
                    content: [
                        {
                            type: "paragraph",
                        },
                    ],
                },
                {
                    type: "summary",
                    content: [
                        {
                            type: "paragraph",
                        },
                    ],
                },
            ],
            type: "doc",
        },
    });

    const handleChange = useCallback(
        ({ state }) => {
            onContentChange(state);
            setState(state);
        },
        [setState, onContentChange]
    );

    return (
        <ProsemirrorEditorStyle style={{ minHeight: "auto" }}>
            <Remirror
                manager={manager}
                initialContent={state}
                autoRender="end"
                onChange={handleChange}
            >
                <SourceEditorButton manager={manager} state={state} />
            </Remirror>
        </ProsemirrorEditorStyle>
    );
};

export default SourceEditor;
