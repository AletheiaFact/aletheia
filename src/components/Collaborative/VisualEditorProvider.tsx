import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../store/store";
import { createWebsocketConnection } from "./utils/createWebsocketConnection";
import ClaimReviewTaskApi from "../../api/ClaimReviewTaskApi";
import { RemirrorContentType } from "remirror";
import { SourceType } from "../../types/Source";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { EditorConfig } from "./utils/getEditorConfig";
import { reviewingSelector } from "../../machines/reviewTask/selectors";
import { useSelector } from "@xstate/react";

interface ContextType {
    editorConfiguration?: any;
    editorSources?: SourceType[];
    setEditorSources?: (data: any) => void;
    data_hash?: string;
    isFetchingEditor?: boolean;
    comments?: any[];
    setComments?: (data: any) => void;
    source?: string;
}

export const VisualEditorContext = createContext<ContextType>({});

interface VisualEditorProviderProps {
    data_hash: string;
    children: React.ReactNode;
    source?: string;
}

export const VisualEditorProvider = (props: VisualEditorProviderProps) => {
    const editorConfig = new EditorConfig();
    const { machineService, reportModel, reviewTaskType } = useContext(
        ReviewTaskMachineContext
    );
    const { enableCollaborativeEdit, enableEditorAnnotations, websocketUrl } =
        useAppSelector((state) => ({
            enableCollaborativeEdit: state?.enableCollaborativeEdit,
            enableEditorAnnotations: state?.enableEditorAnnotations,
            websocketUrl: state?.websocketUrl,
        }));

    const [editorContentObject, setEditorContentObject] = useState(null);
    const [editorSources, setEditorSources] = useState(
        machineService.state.context.reviewData.sources
    );
    const [isFetchingEditor, setIsFetchingEditor] = useState(false);
    const [comments, setComments] = useState(null);
    const readonly = useSelector(machineService, reviewingSelector);

    useEffect(() => {
        const params = { reportModel, reviewTaskType };
        const fetchEditorContentObject = (data_hash) => {
            setIsFetchingEditor(true);
            return ClaimReviewTaskApi.getEditorContentObject(data_hash, params);
        };

        if (reportModel) {
            fetchEditorContentObject(props.data_hash).then((content) => {
                setEditorContentObject(content);
                setIsFetchingEditor(false);
            });
        }
    }, [props.data_hash, reportModel]);

    const { websocketProvider, isCollaborative } = useMemo(() => {
        if (!enableCollaborativeEdit) {
            return { websocketProvider: null, isCollaborative: null };
        }

        const websocketProvider = createWebsocketConnection(
            props.data_hash,
            websocketUrl
        );
        return {
            websocketProvider,
            isCollaborative: websocketProvider?.awareness?.states?.size > 1,
        };
    }, [enableCollaborativeEdit, props.data_hash, websocketUrl]);

    const extensions = useMemo(
        () =>
            editorConfig.getExtensions(
                reviewTaskType,
                websocketProvider,
                enableEditorAnnotations
            ),
        [websocketProvider, reviewTaskType]
    );

    const editorConfiguration = {
        readonly,
        extensions,
        isCollaborative,
        core: { excludeExtensions: ["history"] },
        stringHandler: "html",
        content: isCollaborative
            ? undefined
            : (editorContentObject as RemirrorContentType),
    };

    const value = useMemo(
        () => ({
            editorConfiguration,
            editorSources,
            setEditorSources,
            data_hash: props.data_hash,
            isFetchingEditor,
            comments,
            setComments,
            source: props.source,
        }),
        [
            editorConfiguration,
            editorSources,
            setEditorSources,
            isFetchingEditor,
            comments,
            setComments,
            props.data_hash,
            props.source,
        ]
    );

    return (
        <VisualEditorContext.Provider value={value}>
            {props.children}
        </VisualEditorContext.Provider>
    );
};
