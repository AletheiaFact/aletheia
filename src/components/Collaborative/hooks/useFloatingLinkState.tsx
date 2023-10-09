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
import { CollaborativeEditorContext } from "../CollaborativeEditorProvider";
import useLinkShortcut from "./useLinkShortcut";
import useUpdateSelection from "./useUpdateSelection";
import { uniqueId } from "remirror";

function useFloatingLinkState() {
    const { t } = useTranslation();
    const { editorSources, setEditorSources } = useContext(
        CollaborativeEditorContext
    );

    const [error, setError] = useState(null);
    const chain = useChainedCommands();
    const { isEditing, linkShortcut, setIsEditing, isLoading, setIsLoading } =
        useLinkShortcut();
    const { from, to, empty, ranges } = useCurrentSelection();
    const url = (useAttrs().link()?.href as string) ?? "https://";
    const [href, setHref] = useState<string>(url);

    const isSelected = useUpdateSelection();
    const updateReason = useUpdateReason();
    const floatingLinkPositioner = useMemo(
        () => createMarkPositioner({ type: "link" }),
        []
    );

    useLayoutEffect(() => {
        if (!isEditing) {
            return;
        }

        if (updateReason.doc || updateReason.selection) {
            setIsEditing(false);
        }
    }, [isEditing, setIsEditing, updateReason.doc, updateReason.selection]);

    useEffect(() => setHref(url), [url]);

    const validateFloatingLink = useCallback(() => {
        const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
        if (!urlPattern.test(href)) {
            throw new Error(t("sourceForm:errorMessageValidURL"));
        }
    }, [href, t]);

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

    const submitHref = useCallback(async () => {
        setIsLoading(true);

        try {
            const id = uniqueId();
            await updateFloatingLink(id);
            const { $to } = ranges[0];
            //@ts-ignore
            const field = $to?.path[3]?.type?.name;
            const targetText = $to.doc.textBetween(from, to);
            const newSource = {
                href,
                props: {
                    field,
                    targetText,
                    id,
                },
            };

            validateFloatingLink();
            setEditorSources((sources) => {
                if (!sources) {
                    return [newSource];
                }
                return [...sources, newSource];
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setHref("https://");
            setIsLoading(false);
            setIsEditing(false);
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

    const onRemoveLink = useCallback(async () => {
        setIsLoading(true);
        setEditorSources((sources) => {
            const index = editorSources.findIndex(
                (source: any) => source.href === href
            );
            return sources.filter((_, i) => i !== index);
        });
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
