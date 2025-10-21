import { UseGuards, applyDecorators, SetMetadata } from "@nestjs/common";
import { SessionOrM2MGuard } from "../m2m-or-session.guard";
import { AbilitiesGuard } from "../ability/abilities.guard";
import { M2MOrAbilitiesGuard } from "./m2m-or-abilities.decorator";
import { RequiredRule, CHECK_ABILITY } from "../ability/ability.decorator";

/**
 * Authentication and Authorization decorator options
 */
export interface AuthOptions {
    /**
     * Make this route publicly accessible (no authentication required)
     * @default false
     */
    public?: boolean;

    /**
     * Required abilities for this endpoint
     * If empty, only authentication is required (no authorization check)
     */
    abilities?: RequiredRule[];

    /**
     * Allow M2M (machine-to-machine) authentication in addition to session auth
     * @default false when abilities are specified, true when no abilities
     */
    allowM2M?: boolean;
}

/**
 * Unified authentication and authorization decorator for Aletheia endpoints.
 *
 * This decorator replaces the need for manually combining:
 * - @IsPublic()
 * - @UseGuards(AbilitiesGuard)
 * - @CheckAbilities(...)
 * - @M2MOrAbilities(...)
 *
 * @example
 * // Public route (no auth required)
 * @Auth({ public: true })
 * async getPublicData() {}
 *
 * @example
 * // Authenticated route (any logged-in user)
 * @Auth()
 * async getUserProfile() {}
 *
 * @example
 * // Admin-only route with session auth
 * @Auth({ abilities: [new AdminUserAbility()] })
 * async deleteUser() {}
 *
 * @example
 * // Admin or M2M with Integration role
 * @Auth({
 *   abilities: [new AdminUserAbility()],
 *   allowM2M: true
 * })
 * async createAITask() {}
 *
 * @example
 * // Fact-checker route
 * @Auth({ abilities: [new FactCheckerUserAbility()] })
 * async submitReview() {}
 */
export function Auth(options: AuthOptions = {}): MethodDecorator {
    const { public: isPublic = false, abilities = [], allowM2M } = options;

    // Public routes - no guards needed
    if (isPublic) {
        return applyDecorators(SetMetadata("public", true));
    }

    // Determine if M2M should be allowed
    // Default: allow M2M when no abilities are specified (just authentication)
    // When abilities are specified, require explicit allowM2M: true
    const shouldAllowM2M = allowM2M ?? (abilities.length === 0);

    // If abilities are required
    if (abilities.length > 0) {
        if (shouldAllowM2M) {
            // Use M2MOrAbilitiesGuard (checks M2M first, then abilities)
            return applyDecorators(
                UseGuards(M2MOrAbilitiesGuard),
                SetMetadata(CHECK_ABILITY, abilities)
            );
        } else {
            // Use AbilitiesGuard (session-only)
            return applyDecorators(
                UseGuards(AbilitiesGuard),
                SetMetadata(CHECK_ABILITY, abilities)
            );
        }
    }

    // No abilities specified - just authentication required
    if (shouldAllowM2M) {
        // Allow both M2M and session auth
        return applyDecorators(UseGuards(SessionOrM2MGuard));
    } else {
        // Session auth only (this is handled by the global SessionGuard)
        // No decorator needed as SessionGuard is global
        return applyDecorators();
    }
}

/**
 * Shorthand for public routes
 * @example @Public()
 */
export const Public = () => Auth({ public: true });

/**
 * Shorthand for admin-only routes
 * @example
 * // Session-only admin
 * @AdminOnly()
 *
 * // Admin or M2M
 * @AdminOnly({ allowM2M: true })
 */
export const AdminOnly = (options: { allowM2M?: boolean } = {}) => {
    // Import at usage to avoid circular deps
    const { AdminUserAbility } = require("../ability/ability.decorator");
    return Auth({
        abilities: [new AdminUserAbility()],
        allowM2M: options.allowM2M,
    });
};

/**
 * Shorthand for fact-checker routes
 * @example @FactCheckerOnly()
 */
export const FactCheckerOnly = () => {
    // Import at usage to avoid circular deps
    const { FactCheckerUserAbility } = require("../ability/ability.decorator");
    return Auth({
        abilities: [new FactCheckerUserAbility()],
    });
};

/**
 * Shorthand for regular user routes (read-only)
 * @example @RegularUserOnly()
 */
export const RegularUserOnly = () => {
    // Import at usage to avoid circular deps
    const { RegularUserAbility } = require("../ability/ability.decorator");
    return Auth({
        abilities: [new RegularUserAbility()],
    });
};
