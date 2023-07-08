import type { HTMLProps } from "react";
import React, { useEffect, useRef } from "react";

const DelayAutoFocusInput = ({
    autoFocus,
    ...rest
}: HTMLProps<HTMLInputElement>) => {
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

    return <input ref={inputRef} {...rest} />;
};

export default DelayAutoFocusInput;
