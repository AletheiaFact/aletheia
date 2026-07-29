export interface CaptchaClientConfig {
    /** Known core values: "recaptcha" | "none". Custom providers add their own. */
    provider: string;
    sitekey?: string; // recaptcha
    challengeUrl?: string; // challenge-based providers (e.g. altcha)
}

export interface CaptchaProvider {
    readonly name: string;
    /** Verify a solved captcha token/payload. */
    verify(token: string): Promise<boolean>;
    /** Config the frontend needs to render the right widget. */
    getClientConfig(): CaptchaClientConfig;
    /** Optional: issue a challenge (for challenge-based providers). */
    getChallenge?(): Promise<unknown>;
}
