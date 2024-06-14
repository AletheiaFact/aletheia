import React from "react";
import FloatingLinkToolbar from "./LinkToolBar/FloatingLinkToolbar";
import EditorSourcesList from "./Source/EditorSourceList";

const ClaimReviewEditor = ({ manager, state, editorSources }) => {
    return (
        <>
            <FloatingLinkToolbar />
            <EditorSourcesList
                nodeFromJSON={manager?.schema.nodeFromJSON}
                node={state.doc}
                sources={editorSources}
            />
        </>
    );
};

export default ClaimReviewEditor;
