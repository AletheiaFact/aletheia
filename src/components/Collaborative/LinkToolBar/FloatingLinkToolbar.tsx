import type { ChangeEvent, KeyboardEvent } from "react";
import React, { useCallback } from "react";
import {
    CommandButton,
    FloatingToolbar,
    FloatingWrapper,
    useActive,
    useCurrentSelection,
} from "@remirror/react";
import useFloatingLinkState from "./useFloatingLinkState";
import DelayAutoFocusInput from "./DelayAutoFocusInput";

const FloatingLinkToolbar = () => {
    const {
        isEditing,
        linkPositioner,
        clickEdit,
        onRemove,
        onOpen,
        submitHref,
        href,
        setHref,
        cancelHref,
    } = useFloatingLinkState();
    const active = useActive();
    const activeLink = active.link();
    const { empty } = useCurrentSelection();

    const handleClickEdit = useCallback(() => {
        clickEdit();
    }, [clickEdit]);

    const linkEditButtons = activeLink ? (
        <>
            <CommandButton
                commandName="openLink"
                onSelect={onOpen}
                icon="link"
                enabled
            />
            <CommandButton
                commandName="updateLink"
                onSelect={handleClickEdit}
                icon="pencilLine"
                enabled
            />
            <CommandButton
                commandName="removeLink"
                onSelect={onRemove}
                icon="linkUnlink"
                enabled
            />
        </>
    ) : (
        <CommandButton
            commandName="updateLink"
            onSelect={handleClickEdit}
            icon="link"
            enabled
        />
    );

    return (
        <>
            {!isEditing && <FloatingToolbar>{linkEditButtons}</FloatingToolbar>}
            {!isEditing && empty && (
                <FloatingToolbar positioner={linkPositioner}>
                    {linkEditButtons}
                </FloatingToolbar>
            )}

            <FloatingWrapper
                positioner="selection"
                placement="bottom"
                enabled={isEditing}
                renderOutsideEditor={false}
                key="Link-wrapper"
            >
                <DelayAutoFocusInput
                    autoFocus
                    placeholder="Enter link..."
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setHref(event.target.value)
                    }
                    value={href}
                    onKeyUp={(event: KeyboardEvent<HTMLInputElement>) => {
                        const { code } = event;

                        if (code === "Enter") {
                            submitHref();
                        }

                        if (code === "Escape") {
                            cancelHref();
                        }
                    }}
                />
            </FloatingWrapper>
        </>
    );
};

export default FloatingLinkToolbar;
