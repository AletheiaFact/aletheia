import { useTranslation } from "next-i18next";
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useAppSelector } from "../store/store";
import Typography from "@mui/material/Typography";
import colors from "../styles/colors";

const recaptchaRef = React.createRef<ReCAPTCHA>();

/** Sentinel token the "none" provider reports so gated forms read as solved. */
export const NONE_PROVIDER_TOKEN = "none";

export type CaptchaRenderMode = "recaptcha" | "none";

/**
 * Maps captcha.provider to how AletheiaCaptcha renders. Unknown/unset values
 * fall back to "recaptcha" (the safe default) — a deployer adding a custom
 * provider extends this per server/captcha/WRITING-A-PROVIDER.md.
 */
export function resolveCaptchaRenderMode(provider?: string): CaptchaRenderMode {
    return provider === "none" ? "none" : "recaptcha";
}

interface CaptchaProps {
    onChange: (captchaString: string) => void;
}

const AletheiaCaptcha = forwardRef(({ onChange }: CaptchaProps, ref) => {
    const [showRequired, setShowRequired] = useState(true);
    const { t } = useTranslation();
    const { captcha, vw } = useAppSelector((state) => state);
    const renderMode = resolveCaptchaRenderMode(captcha?.provider);

    useImperativeHandle(ref, () => ({
        resetRecaptcha: () => {
            if (recaptchaRef.current) {
                recaptchaRef.current.reset();
            }
        },
        getValue: () => {
            if (renderMode === "none") {
                return NONE_PROVIDER_TOKEN;
            }
            return recaptchaRef.current?.getValue() ?? "";
        },
    }));

    const handleChangeCaptcha = async () => {
        const recaptchaString: string = recaptchaRef.current.getValue();
        onChange(recaptchaString);
        setShowRequired(false);
    };

    const onExpiredCaptcha = () => {
        onChange("");
        setShowRequired(true);
    };

    // "none": no widget to render — report the sentinel immediately so gated
    // forms read as already solved, without any change to the 7 consumers.
    useEffect(() => {
        if (renderMode === "none") {
            onChange(NONE_PROVIDER_TOKEN);
            setShowRequired(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [renderMode]);

    if (renderMode === "none") {
        return null;
    }

    return (
        <div>
            <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={captcha?.sitekey}
                size={vw?.xs ? "compact" : "normal"}
                onChange={handleChangeCaptcha}
                onExpired={onExpiredCaptcha}
            />
            {showRequired && (
                <Typography
                    variant="h1"
                    style={{ color: colors.error, fontSize: 16 }}
                >
                    {t("common:requiredFieldError")}
                </Typography>
            )}
        </div>
    );
});

export default AletheiaCaptcha;
