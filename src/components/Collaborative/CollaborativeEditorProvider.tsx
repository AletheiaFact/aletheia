import { createContext, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../store/store";
import { createWebsocketConnection } from "./utils/createWebsocketConnection";
import ClaimReviewTaskApi from "../../api/ClaimReviewTaskApi";
import { RemirrorJSON } from "remirror";
import { SourceType } from "../../types/Source";

interface ContextType {
    websocketProvider: any;
    editorContentObject?: RemirrorJSON;
    setEditorContentObject?: (data: any) => void;
    editorSources?: SourceType[];
    setEditorSources?: (data: any) => void;
    data_hash?: string;
    isFetchingEditor?: boolean;
    comments?: any[];
    setComments?: (data: any) => void;
}

export const CollaborativeEditorContext = createContext<ContextType>({
    websocketProvider: null,
});

interface CollaborativeEditorProviderProps {
    data_hash: string;
    children: React.ReactNode;
}

export const CollaborativeEditorProvider = (
    props: CollaborativeEditorProviderProps
) => {
    const { enableCollaborativeEdit } = useAppSelector((state) => ({
        enableCollaborativeEdit: state?.enableCollaborativeEdit,
    }));

    const [editorContentObject, setEditorContentObject] = useState(null);
    const [editorSources, setEditorSources] = useState([]);
    const [isFetchingEditor, setIsFetchingEditor] = useState(false);
    const { websocketUrl } = useAppSelector((state) => state);
    const [comments, setComments] = useState(null);

    useEffect(() => {
        const fetchEditorContentObject = (data_hash) => {
            setIsFetchingEditor(true);
            return ClaimReviewTaskApi.getEditorContentObject(data_hash);
        };

        fetchEditorContentObject(props.data_hash).then((content) => {
            setEditorContentObject(content);
            setIsFetchingEditor(false);
        });
    }, [props.data_hash]);

    const websocketProvider = useMemo(() => {
        if (enableCollaborativeEdit) {
            return createWebsocketConnection(props.data_hash, websocketUrl);
        }
        return null;
    }, [enableCollaborativeEdit, props.data_hash, websocketUrl]);

    return (
        <CollaborativeEditorContext.Provider
            value={{
                websocketProvider,
                editorContentObject,
                setEditorContentObject,
                editorSources,
                setEditorSources,
                data_hash: props.data_hash,
                isFetchingEditor,
                comments,
                setComments,
            }}
        >
            {props.children}
        </CollaborativeEditorContext.Provider>
    );
};
