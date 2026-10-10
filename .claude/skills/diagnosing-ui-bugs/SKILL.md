---
name: diagnosing-ui-bugs
description: Use when a rendered UI problem is reported — "looks broken", collapsed or invisible elements, clipped or mispositioned content, wrong only on one browser or one viewport — before proposing a CSS or component fix.
---

# Diagnosing UI Bugs

## Overview

**Reading source generates hypotheses. Only measuring the rendered DOM confirms one.**

CSS bugs live in the computed cascade — percentage chains, flex sizing, engine
differences — none of it visible in source. A fix proposed from source alone is
a guess, however confident it feels.

```
NO CSS FIX WITHOUT A MEASUREMENT FROM THE FAILING ENVIRONMENT
```

## 1. Get the artifact first

"Looks broken" forks into incompatible investigations:

| Symptom | Fault lives in |
|---|---|
| Nothing happens on click | Handler, state, error boundary |
| Backdrop but no dialog | z-index, portal, off-screen position |
| Renders but misstyled | Cascade, specificity, class not applied |
| Renders but content missing | Sizing chain — collapsed height/width |

Ask for a screenshot **before** theorising. Diagnosing the wrong failure mode is
the most expensive mistake available here.

## 2. Measure the deployed environment

Stage is `https://test.aletheiafact.org` (deploys from `stage`). Drive it with
Playwright and read computed values:

```js
const el = document.querySelector('.MuiDialog-root');
({ rect: el.getBoundingClientRect(), ...getComputedStyle(el) });
```

Other probes: `document.styleSheets` → `cssRules` (did the rule ship?),
`fetch('/locales/pt/<ns>.json')` (i18n), `window.__BUILD_MANIFEST` (which code is
live?). Much is reachable logged-out — `AffixCTAButton` mounts on every page via
`MainApp`, so shared-modal behaviour is testable without auth.

## 3. Isolate by toggling one declaration

Don't reason about which declaration is guilty — bisect it live:

```js
el.style.alignSelf = 'auto';   // one property, re-measure
```

## 4. Confirm the engine

**Every browser on iOS is WebKit, including Chrome.** "Broken in Chrome on my
phone" is a WebKit datapoint. Engines diverge most on indefinite percentage
resolution and flex `min-height: auto`.

Separate the **defect** from its **symptom** — a defect can exist in both engines
while only one renders it visibly.

Run real WebKit from the Playwright cache; match `playwright-core` to the cached
revision or launch hangs:

```bash
ls ~/Library/Caches/ms-playwright/   # e.g. webkit-2182
npm i playwright-core@1.53.0         # 1.53.0 -> webkit 2182
```

A standalone HTML replica of the component's DOM reproduces the bug and tests
fixes far cheaper than booting the app.

## 5. Sweep every call site of a shared component

Changing a shared component changes all consumers. Enumerate them, render each
config before/after at ≥2 viewports in both engines, diff the geometry, report
parity as a count. In the incident below this caught a fix that silently moved
`ClassificationModal` to `x=0`; review would not have.

## 6. Report numbers and gaps

Give before/after measurements and state what you did **not** verify. CI
(`nodejs.yml`) runs Cypress on Blink only — green says nothing about WebKit.

## Red Flags — stop and measure

| Thought | Reality |
|---|---|
| "The cause is obviously X" | That's a hypothesis, not a measurement. |
| "grep shows no other usage" | Was output truncated by `head`? Count matches. |
| "styled-components/emotion does X" | Library internals are testable in 30s. Test, don't assert. |
| "It only breaks on Safari" | Check Blink too — the defect may be shared. |
| "Only this component changed" | Shared component = every call site changed. |
| "CI is green" | CI runs one engine. |
| "Found a real defect, ship the fix" | A real defect isn't automatically *the reported* defect. |

## Real-World Impact

`AletheiaModal` set `align-self` on the MUI Dialog root. Per CSS Box Alignment an
abspos box with both block offsets set stretches; any other `align-self` makes it
shrink-to-fit. The root went auto-height, `.MuiDialog-container` (`height: 100%`)
resolved to 0 in WebKit, `.MuiDialogContent-root` collapsed, and every modal
rendered as a bare title bar on Safari — desktop and mobile. Invisible in source;
obvious in one measurement (root 84px vs 844px). See PR #2581.
