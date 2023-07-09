import React, { useEffect, useRef } from "react";
import colors from "../../../../styles/colors";
import SourceDialogHeader from "./SourceDialogHeader";
import InsertSourceForm from "./InsertSourceForm";

const DelayAutoFocusInput = ({
    autoFocus,
    handleClickButton,
    error,
    onCloseModal,
    activeLink,
    onRemoveLink,
    ...rest
}) => {
    const inputRef = useRef<HTMLInputElement>();

    useEffect(() => {
        if (!autoFocus) {
            return;
        }

        const frame = window.requestAnimationFrame(() => {
            inputRef.current?.focus();
        });

        return () => {
            window.cancelAnimationFrame(frame);
        };
    }, [autoFocus]);

    return (
        <div
            style={{
                background: colors.lightGray,
                padding: "10px",
                borderRadius: "8px",
                boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.25)",
            }}
        >
            <SourceDialogHeader onCloseModal={onCloseModal} />
            <InsertSourceForm
                inputRef={inputRef}
                handleClickButton={handleClickButton}
                activeLink={activeLink}
                onRemoveLink={onRemoveLink}
                error={error}
                {...rest}
            />
        </div>
    );
};

export default DelayAutoFocusInput;
