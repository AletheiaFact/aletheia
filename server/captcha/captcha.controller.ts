import { Controller, Get, Header, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Public } from "../auth/decorators/auth.decorator";
import type { Response } from "express";

@Controller()
export class CaptchaController {
    constructor(private configService: ConfigService) {}

    @Public()
    @Get("api/captcha-bridge")
    @Header("Content-Type", "text/html")
    @Header("Cache-Control", "max-age=86400")
    getCaptchaBridge(@Res() res: Response) {
        const sitekey = this.configService.get<string>("recaptcha_sitekey");

        res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Captcha</title>
  <script src="https://www.google.com/recaptcha/api.js" async defer></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80px;
      background: transparent;
      font-family: system-ui, sans-serif;
    }
    .captcha-wrapper { transform: scale(0.9); transform-origin: center; }
  </style>
</head>
<body>
  <div class="captcha-wrapper">
    <div class="g-recaptcha"
         data-sitekey="${sitekey}"
         data-callback="onCaptchaSuccess"
         data-expired-callback="onCaptchaExpired"
         data-error-callback="onCaptchaError">
    </div>
  </div>

  <script>
    function postToParent(payload) {
      window.parent.postMessage(payload, '*');
    }

    function onCaptchaSuccess(token) {
      postToParent({ type: 'hermes-captcha-token', token: token });
    }

    function onCaptchaExpired() {
      postToParent({ type: 'hermes-captcha-expired' });
    }

    function onCaptchaError() {
      postToParent({ type: 'hermes-captcha-error' });
    }
  </script>
</body>
</html>`);
    }
}
