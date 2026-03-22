import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useAppSelector } from "../../store/store";
import { createWebsocketConnection } from "./utils/createWebsocketConnection";
import ReviewTaskApi from "../../api/reviewTaskApi";
import { RemirrorContentType } from "remirror";
import { SourceType } from "../../types/Source";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { EditorConfig } from "./utils/getEditorConfig";
import { useReviewTaskPermissions } from "../../machines/reviewTask/usePermissions";

interface ContextType {
    editorConfiguration?: any;
    editorSources?: SourceType[];
    setEditorSources?: (data: any) => void;
    data_hash?: string;
    isFetchingEditor?: boolean;
    comments?: any[];
    setComments?: (data: any) => void;
    source?: string;
    canShowEditor?: boolean;
}

export const VisualEditorContext = createContext<ContextType>({});

const editorConfig = new EditorConfig();

interface VisualEditorProviderProps {
    data_hash: string;
    children: React.ReactNode;
    source?: string;
}

export const VisualEditorProvider = (props: VisualEditorProviderProps) => {
    const editorConfig = new EditorConfig();
    const {
        machineService,
        reportModel,
        reviewTaskType,
        publishedReview,
        form,
    } = useContext(ReviewTaskMachineContext);
    const {
        enableCollaborativeEdit,
        enableEditorAnnotations,
        websocketUrl,
        enableReviewersUpdateReport,
    } = useAppSelector((state) => ({
        enableCollaborativeEdit: state?.enableCollaborativeEdit,
        enableEditorAnnotations: state?.enableEditorAnnotations,
        enableReviewersUpdateReport: state?.enableReviewersUpdateReport,
        websocketUrl: state?.websocketUrl,
    }));

    const [editorContentObject, setEditorContentObject] = useState(null);
    const [editorSources, setEditorSources] = useState(
        machineService.state.context.reviewData.sources
    );
    const [isFetchingEditor, setIsFetchingEditor] = useState(false);
    const [comments, setComments] = useState(null);
    // Use centralized permission system
    const permissions = useReviewTaskPermissions();

    const isInitialFormLoad = useRef(true);

    const fetchEditorContent = useCallback(
        (cancelled: { current: boolean }) => {
            if (!reportModel) return;

            const params = { reportModel, reviewTaskType };
            setIsFetchingEditor(true);
            ReviewTaskApi.getEditorContentObject(props.data_hash, params).then(
                (content) => {
                    if (cancelled.current) return;
                    setEditorContentObject(content);
                    const currentSources =
                        machineService.state.context.reviewData.sources;
                    if (currentSources) {
                        setEditorSources(currentSources);
                    }
                    setIsFetchingEditor(false);
                }
            );
        },
        [props.data_hash, reportModel, reviewTaskType]
    );

    // Fetch editor content on mount
    useEffect(() => {
        const cancelled = { current: false };
        fetchEditorContent(cancelled);
        return () => {
            cancelled.current = true;
        };
    }, [props.data_hash, reportModel]);

    // Re-fetch editor content when the form changes (e.g., after state transitions).
    // Also reset comments so they are re-initialized from machine context
    // (prevents resolved comments from reappearing).
    useEffect(() => {
        if (isInitialFormLoad.current) {
            isInitialFormLoad.current = false;
            return;
        }

        if (!form || !reportModel) return;

        // Reset comments so CommentContainer re-filters from machine context
        setComments(null);

        const hasVisualEditor = form.some(
            (field) => field.fieldName === "visualEditor"
        );
        if (!hasVisualEditor) return;

        const cancelled = { current: false };
        fetchEditorContent(cancelled);
        return () => {
            cancelled.current = true;
        };
    }, [form]);

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

    const getExtensions = useCallback(
        () =>
            editorConfig.getExtensions(
                reviewTaskType,
                websocketProvider,
                enableEditorAnnotations
            ),
        [reviewTaskType, websocketProvider, enableEditorAnnotations]
    );

    const editorConfiguration = useMemo(
        () => ({
            readonly: permissions.editorReadonly,
            extensions: getExtensions,
            isCollaborative,
            core: { excludeExtensions: ["history"] },
            stringHandler: "html",
            content: isCollaborative
                ? undefined
                : (editorContentObject as RemirrorContentType),
        }),
        [
            permissions.editorReadonly,
            getExtensions,
            isCollaborative,
            editorContentObject,
        ]
    );

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
            canShowEditor: permissions.canViewEditor,
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
            permissions.canViewEditor,
        ]
    );

    return (
        <VisualEditorContext.Provider value={value}>
            {props.children}
        </VisualEditorContext.Provider>
    );
};
