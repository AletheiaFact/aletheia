import { SetMetadata } from "@nestjs/common";

/**
 * @deprecated Use @Public() or @Auth({ public: true }) from auth.decorator.ts instead
 *
 * This decorator is deprecated in favor of the unified Auth decorator pattern.
 *
 * Migration:
 * ```typescript
 * // Before:
 * @IsPublic()
 *
 * // After:
 * import { Public } from "../auth/decorators/auth.decorator";
 * @Public()
 * ```
 *
 * See: server/auth/AUTH_DECORATOR_MIGRATION.md for full migration guide
 */
export const IsPublic = () => SetMetadata("public", true);
