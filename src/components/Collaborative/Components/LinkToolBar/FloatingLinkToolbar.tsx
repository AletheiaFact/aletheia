import type { ChangeEvent, KeyboardEvent } from "react";
import {
    CommandButton,
    FloatingToolbar,
    FloatingWrapper,
    useActive,
    useCurrentSelection,
} from "@remirror/react";
import React, { useCallback } from "react";

import SourceDialog from "./Dialog/SourceDialog";
import useFloatingLinkState from "../../hooks/useFloatingLinkState";
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
        isLoading,
    } = useFloatingLinkState();
    const { t } = useTranslation();
    const { empty } = useCurrentSelection();
    const active = useActive();
    const activeLink = active.link();

    const handleClickEditLink = useCallback(() => {
        clickEdit();
    }, [clickEdit]);

    const handleInputChange = ({
        target: { value },
    }: ChangeEvent<HTMLInputElement>) => {
        // Prevent href with double http protocol
        const href = value.replace(/(https?:\/\/)(https?:\/\/)+/, "$1");
        setHref(href);
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

    const handleClickButton = () => submitHref();

    const handleCloseModal = () => cancelHref();

    const handleRemoveLink = () => onRemoveLink();

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
            {!isEditing && (
                <FloatingToolbar data-cy="testFloatingLinkToolbar">
                    {linkEditButton}
                </FloatingToolbar>
            )}
            {!isEditing && isSelected && empty && (
                <FloatingToolbar
                    data-cy="testFloatingLinkToolbar"
                    positioner={linkPositioner}
                >
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
                    isLoading={isLoading}
                />
            </FloatingWrapper>
        </>
    );
};

export default FloatingLinkToolbar;
