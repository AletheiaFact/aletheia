import {
    AnnotationExtension,
    LinkExtension,
    PlaceholderExtension,
    YjsExtension,
} from "remirror/extensions";
import React, { useCallback, useContext, useEffect } from "react";
import { Remirror, useRemirror } from "@remirror/react";

import { CollaborativeEditorContext } from "./CollaborativeEditorProvider";
import CollaborativeEditorStyle from "./CollaborativeEditor.style";
import Editor from "./Editor";
import FloatingLinkToolbar from "./Components/LinkToolBar/FloatingLinkToolbar";
import SummaryExtension from "./Form/SummaryExtesion";
import QuestionExtension from "./Form/QuestionExtension";
import ReportExtension from "./Form/ReportExtension";
import VerificationExtesion from "./Form/VerificationExtension";
import { TrailingNodeExtension } from "remirror/extensions";
import { RemirrorContentType } from "remirror";
import EditorSourcesList from "./Components/Source/EditorSourceList";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { reviewingSelector } from "../../machines/reviewTask/selectors";
import { useSelector } from "@xstate/react";
import CommentContainer from "./Comment/CommentContainer";
import { useAppSelector } from "../../store/store";

interface CollaborativeEditorProps {
    placeholder: string;
    onContentChange: (state: any) => void;
}

const CollaborativeEditor = ({
    placeholder,
    onContentChange,
}: CollaborativeEditorProps) => {
    const {
        websocketProvider,
        editorContentObject,
        editorSources,
        setEditorSources,
    } = useContext(CollaborativeEditorContext);
    const enableEditorAnnotations = useAppSelector(
        (state) => state?.enableEditorAnnotations
    );
    const { machineService } = useContext(ReviewTaskMachineContext);
    const readonly = useSelector(machineService, reviewingSelector);
    const users = websocketProvider?.awareness?.states?.size;
    const isCollaborative = users > 1;

    useEffect(() => {
        const sources = machineService.state.context.reviewData.sources;
        setEditorSources(sources);
    }, [machineService.state.context.reviewData.sources, setEditorSources]);

    function createExtensions() {
        const extensions: any = [
            new PlaceholderExtension({ placeholder }),
            new LinkExtension({
                extraAttributes: {
                    id: () => null,
                },
                autoLink: true,
                selectTextOnClick: true,
            }),
            new SummaryExtension({ disableExtraAttributes: true }),
            new QuestionExtension({ disableExtraAttributes: true }),
            new ReportExtension({ disableExtraAttributes: true }),
            new VerificationExtesion({ disableExtraAttributes: true }),
            new TrailingNodeExtension(),
        ];
        if (websocketProvider) {
            extensions.push(
                new YjsExtension({ getProvider: () => websocketProvider })
            );
        }

        if (enableEditorAnnotations) {
            // TODO: Make annotations shared across documents
            extensions.push(new AnnotationExtension());
        }

        return extensions;
    }

    const { manager, state, setState } = useRemirror({
        extensions: createExtensions,
        core: { excludeExtensions: ["history"] },
        stringHandler: "html",
        content: isCollaborative
            ? undefined
            : (editorContentObject as RemirrorContentType),
    });

    const handleChange = useCallback(
        ({ state }) => {
            onContentChange(state);
            setState(state);
        },
        [setState, onContentChange]
    );

    return (
        <CollaborativeEditorStyle>
            <Remirror
                manager={manager}
                initialContent={state}
                autoFocus
                autoRender="end"
                onChange={handleChange}
                editable={!readonly}
            >
                <FloatingLinkToolbar />
                <Editor editable={readonly} state={state} />
                <CommentContainer readonly={readonly} state={state} />
                <EditorSourcesList node={state.doc} sources={editorSources} />
            </Remirror>
        </CollaborativeEditorStyle>
    );
};

export default CollaborativeEditor;
