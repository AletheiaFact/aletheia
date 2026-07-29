export interface CaptchaClientConfig {
    /** Known core values: "recaptcha" | "none". Custom providers add their own. */
    provider: string;
    sitekey?: string;
    challengeUrl?: string;
}
