import {
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";
import { createMarkPositioner } from "remirror/extensions";

import {
    useAttrs,
    useChainedCommands,
    useCurrentSelection,
    useUpdateReason,
} from "@remirror/react";
import { useTranslation } from "next-i18next";
import { VisualEditorContext } from "../VisualEditorProvider";
import useLinkShortcut from "./useLinkShortcut";
import { uniqueId } from "remirror";
import { validateFloatingLink } from "../../../utils/ValidateFloatingLink";

function useFloatingLinkState() {
    const { t } = useTranslation();
    const { editorSources, setEditorSources } = useContext(VisualEditorContext);

    const [error, setError] = useState(null);
    const chain = useChainedCommands();
    const { isEditing, linkShortcut, setIsEditing, isLoading, setIsLoading } =
        useLinkShortcut();
    const { from, to, empty, ranges } = useCurrentSelection();
    const { $to } = ranges[0];
    const url = (useAttrs().link()?.href as string) ?? "https://";
    const selectedSourceId = useAttrs().link()?.id;
    const [href, setHref] = useState<string>(url);
    const isSelected = !empty;
    const updateReason = useUpdateReason();
    const floatingLinkPositioner = useMemo(
        () => createMarkPositioner({ type: "link" }),
        []
    );

    useLayoutEffect(() => {
        if (!isEditing) {
            return;
        }

        if (updateReason.doc || !isSelected) {
            setIsEditing(false);
        }
    }, [isEditing, setIsEditing, updateReason.doc, updateReason.selection]);

    useEffect(() => setHref(url), [url]);

    const updateFloatingLink = useCallback(
        (id) => {
            const range = linkShortcut ?? undefined;

            if (href === "") {
                chain.removeLink();
            } else {
                chain.updateLink({ href, auto: true, id }, range);
            }
            chain.focus(linkShortcut?.to ?? to).run();
        },
        [chain, href, linkShortcut, to]
    );

    const submitHref = useCallback(() => {
        setIsLoading(true);

        try {
            const id = uniqueId();
            //@ts-ignore
            const field = $to?.path[3]?.type?.name;
            const targetText = $to.doc.textBetween(from, to);
            const newSource = {
                href,
                props: {
                    field,
                    targetText,
                    id,
                    textRange: [from, to],
                },
            };

            validateFloatingLink();
            setEditorSources((sources) => {
                if (!sources) {
                    return [newSource];
                }
                return [...sources, newSource];
            });
            updateFloatingLink(id);
            setIsEditing(false);
        } catch (error) {
            setError(error.message);
        } finally {
            setHref("https://");
            setIsLoading(false);
        }
    }, [
        setIsLoading,
        ranges,
        from,
        to,
        href,
        validateFloatingLink,
        setEditorSources,
        updateFloatingLink,
        setIsEditing,
    ]);

    const areSourcesIdsEqual = (sourceId, selectedSourceId) =>
        sourceId === selectedSourceId;

    const onRemoveLink = useCallback(async () => {
        setIsLoading(true);
        const targetText = $to.doc.textBetween(from, to);
        const [
            {
                props: { id: deletedSourceId },
            },
        ] = editorSources.filter((source) => {
            return (
                areSourcesIdsEqual(source.props.id, selectedSourceId) &&
                source.props.targetText === targetText
            );
        });
        setEditorSources((sources) =>
            sources.filter(({ props }) => props.id !== deletedSourceId)
        );
        chain.removeLink().focus().run();
        setIsLoading(false);
    }, [chain, editorSources, href, setEditorSources, setIsLoading]);

    const cancelHref = useCallback(() => {
        setIsEditing(false);
    }, [setIsEditing]);

    const clickEdit = useCallback(() => {
        setError(null);
        if (empty) {
            chain.selectLink();
        }

        setIsEditing(true);
    }, [chain, empty, setIsEditing]);

    return useMemo(
        () => ({
            href,
            setHref,
            linkShortcut,
            linkPositioner: floatingLinkPositioner,
            isEditing,
            clickEdit,
            onRemoveLink,
            submitHref,
            cancelHref,
            isSelected,
            error,
            isLoading,
        }),
        [
            href,
            linkShortcut,
            floatingLinkPositioner,
            isEditing,
            clickEdit,
            onRemoveLink,
            submitHref,
            cancelHref,
            isSelected,
            error,
            isLoading,
        ]
    );
}

export default useFloatingLinkState;
