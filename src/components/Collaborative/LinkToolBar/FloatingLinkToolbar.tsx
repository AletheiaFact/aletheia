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
import SourceDialog from "./Dialog/SourceDialog";
import { useTranslation } from "next-i18next";

const FloatingLinkToolbar = () => {
    const {
        isEditing,
        linkPositioner,
        clickEdit,
        onRemoveLink,
        submitHref,
        href,
        setHref,
        isSelected,
        cancelHref,
        error,
    } = useFloatingLinkState();
    const { t } = useTranslation();
    const { empty } = useCurrentSelection();
    const active = useActive();
    const activeLink = active.link();

    const handleClickEditLink = useCallback(() => {
        clickEdit();
    }, [clickEdit]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setHref(event.target.value);
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        const { code } = event;

        if (code === "Enter") {
            event.preventDefault();
            submitHref();
        }

        if (code === "Escape") {
            cancelHref();
        }
    };

    const handleClickButton = () => {
        submitHref();
    };

    const handleCloseModal = () => {
        cancelHref();
    };

    const handleRemoveLink = () => {
        onRemoveLink();
    };

    const linkEditButton = (
        <CommandButton
            commandName="updateLink"
            onSelect={handleClickEditLink}
            icon="link"
            enabled
        />
    );

    return (
        <>
            {!isEditing && <FloatingToolbar>{linkEditButton}</FloatingToolbar>}
            {!isEditing && isSelected && empty && (
                <FloatingToolbar positioner={linkPositioner}>
                    {linkEditButton}
                </FloatingToolbar>
            )}
            <FloatingWrapper
                positioner="selection"
                placement="bottom"
                enabled={isEditing}
                renderOutsideEditor={false}
                key="Link-wrapper"
            >
                <SourceDialog
                    autoFocus
                    placeholder={t("sourceForm:placeholder")}
                    value={href}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    handleClickButton={handleClickButton}
                    onCloseModal={handleCloseModal}
                    error={error}
                    activeLink={activeLink}
                    onRemoveLink={handleRemoveLink}
                />
            </FloatingWrapper>
        </>
    );
};

export default FloatingLinkToolbar;
