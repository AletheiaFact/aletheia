# Writing a Custom Captcha Provider

Aletheia's captcha verification is pluggable. Core ships two providers —
`recaptcha` (Google reCAPTCHA, the default) and `none` (captcha disabled) —
and exposes the `CaptchaProvider` interface so you can add your own without
forking any controller.

## The contract

```ts
// server/captcha/captcha.types.ts
export interface CaptchaClientConfig {
    provider: string;       // e.g. "recaptcha" | "none" | your own value
    sitekey?: string;       // widget-based providers (e.g. recaptcha)
    challengeUrl?: string;  // challenge-based providers (e.g. altcha)
}

export interface CaptchaProvider {
    readonly name: string;
    verify(token: string): Promise<boolean>;
    getClientConfig(): CaptchaClientConfig;
    getChallenge?(): Promise<unknown>; // only if your provider issues challenges
}
```

Implement this interface, and your provider works with:

- `CaptchaService.validate(token)` — every existing controller call site.
- `GET /api/captcha/config` — the frontend fetches/consumes this via
  `captcha` in Redux.
- `GET /api/captcha/challenge` — only relevant if you implement `getChallenge`;
  otherwise the endpoint 404s automatically, which is fine.

## Worked example: ALTCHA

`server/captcha/providers/altcha.provider.example.ts` and
`src/components/AletheiaCaptcha.altcha.example.tsx` are a complete,
end-to-end reference for wiring up [ALTCHA](https://altcha.org), an open,
self-hosted, privacy-friendly proof-of-work captcha with no external
verification service. They are excluded from the build (`.example.ts(x)`
suffix, in every tsconfig's `exclude`) and add no dependency to
`package.json` — copy them in as your starting point.

## Three wiring steps

### 1. Install your provider's dependencies (if any)

For the ALTCHA example: `yarn add altcha-lib @altcha/widget`.

### 2. Add a `case` to the backend factory

`server/captcha/captcha-provider.factory.ts`:

```ts
export function createCaptchaProvider(
    config: ConfigService,
    http: HttpService
): CaptchaProvider {
    switch (config.get<string>("captcha.provider") ?? "recaptcha") {
        case "none":
            return new NoopCaptchaProvider();
        case "altcha": // <- your new case
            return new AltchaCaptchaProvider(config);
        default:
            return new RecaptchaProvider(http, config);
    }
}
```

Copy `providers/altcha.provider.example.ts` to `providers/altcha.provider.ts`
(dropping `.example`) so it re-enters the TypeScript build, and import it here.

### 3. Add your config block

```yaml
captcha:
  provider: altcha
  altcha:
    hmac_key: YOUR_HMAC_SECRET
```

### 4. Extend the frontend dispatch

`src/components/AletheiaCaptcha.tsx`'s `resolveCaptchaRenderMode` currently
maps everything that isn't `"none"` to `"recaptcha"` (a safe fallback for
unrecognized providers). To render your own widget instead of falling back,
widen the render-mode type and add a branch, using
`AletheiaCaptcha.altcha.example.tsx` as your starting point for the widget
itself. Keep the same imperative handle contract (`getValue()`,
`resetRecaptcha()`) so the 7 existing consumers (`SharedFormFooter.tsx`,
`VerificationRequestDetailDrawer.tsx`, `Modal/ToolbarActionsModal.tsx`,
`Login/SignUpForm.tsx`, `Claim/CreateClaim/BaseClaimForm.tsx`,
`Modal/RecaptchaModal.tsx`, and `ClaimReview/form/DynamicReviewTaskForm.tsx`
via `RecaptchaModal`) keep working unmodified.

## Using the challenge endpoint

If your provider issues challenges (like ALTCHA), implement `getChallenge()`
on your `CaptchaProvider`. `GET /api/captcha/challenge` automatically calls it
and returns the result — no controller changes needed. Point your frontend
widget at the `challengeUrl` your `getClientConfig()` returns (by convention,
`/api/captcha/challenge`).

## A note on `none`

Setting `captcha.provider: none` disables bot protection on every form that
uses `AletheiaCaptcha` — verification always succeeds. This is intended for
closed or self-hosted deployments where public-facing abuse isn't a concern.
Don't use it on a publicly reachable instance without understanding that
trade-off.

## Testing your provider

Core's own providers (`RecaptchaProvider`, `NoopCaptchaProvider`) and the
factory (`createCaptchaProvider`) are covered by plain Vitest unit tests with
mocked `ConfigService`/`HttpService` — see
`server/captcha/providers/recaptcha.provider.spec.ts` and
`server/captcha/captcha-provider.factory.spec.ts` for the pattern. There is no
requirement to test the `.example.ts(x)` files themselves — they're excluded
from the build and CI never touches them.
