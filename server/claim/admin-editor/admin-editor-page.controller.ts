import { Controller, Get, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { Request, Response } from "express";
import { parse } from "url";
import { AdminOnly } from "../../auth/decorators/auth.decorator";
import { ViewService } from "../../view/view.service";

/**
 * SSR page controller for the admin claim editor. Renders the Next.js page
 * at `src/pages/admin-claim-edit.tsx` via ViewService.
 *
 * Uses a hard-coded controller prefix (not `:namespace?`) to avoid the
 * NameSpaceGuard binding the path segment as a namespace slug. Admin scope
 * is enforced by `@AdminOnly()`; namespace context is carried via query
 * parameter when needed.
 */
@ApiTags("admin-claim-editor")
@Controller("admin")
export class AdminEditorPageController {
    constructor(private readonly viewService: ViewService) {}

    @AdminOnly()
    @Get("claim-edit")
    async page(@Req() req: Request, @Res() res: Response) {
        const parsedUrl = parse(req.url, true);
        const query = parsedUrl.query ?? {};
        await this.viewService.render(req, res, "/admin-claim-edit", query);
    }
}
