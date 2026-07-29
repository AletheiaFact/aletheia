/**
 * REFERENCE EXAMPLE — excluded from the build (see src/tsconfig.json's
 * `*.example.tsx` exclude entry). Not imported anywhere in core, adds no
 * dependency, never type-checked or run by CI.
 *
 * Shows how an ALTCHA branch would slot into AletheiaCaptcha's provider
 * dispatch (see AletheiaCaptcha.tsx and
 * server/captcha/WRITING-A-PROVIDER.md). Requires `yarn add @altcha/widget`
 * (registers the <altcha-widget> custom element as an import side effect).
 *
 * The @altcha/widget custom-element attribute/event names below reflect its
 * documented API at the time this example was written; confirm against your
 * installed version's docs before relying on it, since this file is never
 * type-checked or run.
 */
import "@altcha/widget";
import React, { useEffect, useRef } from "react";

interface AltchaWidgetHandle {
    getValue: () => string;
    resetRecaptcha: () => void;
}

interface AltchaWidgetProps {
    challengeUrl: string;
    onChange: (token: string) => void;
}

/**
 * Thin wrapper around <altcha-widget>, adapted to the same imperative
 * handle contract AletheiaCaptcha exposes (getValue, resetRecaptcha) so it
 * can be swapped in without touching the 7 consuming forms/modals.
 */
const AltchaCaptchaExample = React.forwardRef<
    AltchaWidgetHandle,
    AltchaWidgetProps
>(({ challengeUrl, onChange }, ref) => {
    const valueRef = useRef("");
    const widgetRef = useRef<HTMLElement & { reset?: () => void }>(null);

    React.useImperativeHandle(ref, () => ({
        getValue: () => valueRef.current,
        resetRecaptcha: () => {
            valueRef.current = "";
            widgetRef.current?.reset?.();
        },
    }));

    useEffect(() => {
        const el = widgetRef.current;
        const handleStateChange = (event: Event) => {
            const detail = (event as CustomEvent).detail;
            if (detail?.state === "verified" && detail?.payload) {
                valueRef.current = detail.payload;
                onChange(detail.payload);
            } else if (
                detail?.state === "expired" ||
                detail?.state === "error"
            ) {
                valueRef.current = "";
                onChange("");
            }
        };
        el?.addEventListener("statechange", handleStateChange);
        return () => el?.removeEventListener("statechange", handleStateChange);
    }, [onChange]);

    return React.createElement("altcha-widget", {
        ref: widgetRef,
        challengeurl: challengeUrl,
    });
});

export default AltchaCaptchaExample;
