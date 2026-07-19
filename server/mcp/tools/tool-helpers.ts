import { Logger } from "@nestjs/common";
import { AbilityFactory, Action } from "../../auth/ability/ability.factory";
import { NameSpaceService } from "../../auth/name-space/name-space.service";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";

const logger = new Logger("McpTools");

/**
 * The MCP endpoint is @Public, so the global NameSpaceGuard/AbilitiesGuard
 * never run. These helpers re-run the platform's own authorization
 * primitives (CASL AbilityFactory, NameSpace collection membership) driven
 * entirely by the authenticated user resolved by McpAuthGuard (never by
 * caller-supplied arguments), so MCP and the web app share one source of
 * truth instead of two hand-rolled, divergent checks.
 */
interface McpUser {
    isM2M?: boolean;
    _id?: string;
    role?: Record<string, string>;
    namespace?: string;
    subject?: string;
    clientId?: string;
}

/**
 * Reject any namespace the user is not a member of, using the platform's
 * NameSpace collection membership (same source of truth as NameSpaceGuard).
 * The default/main namespace is open to any authenticated user (matches
 * NameSpaceGuard bypassing unscoped routes). Caller-supplied nameSpace is
 * untrusted. Fails closed.
 */
export async function assertNamespaceAccess(
    nameSpaceService: NameSpaceService,
    user: McpUser,
    nameSpace: string = NameSpaceEnum.Main
): Promise<void> {
    if (nameSpace === NameSpaceEnum.Main) return;
    const namespace = await nameSpaceService.findOne({ slug: nameSpace });
    if (!namespace) {
        throw new Error(`Namespace "${nameSpace}" not found`);
    }
    const userId = user?._id?.toString();
    // NameSpaceService.findOne() doesn't .populate("users"), so `users` is
    // an array of raw ObjectId refs, not populated User documents (unlike
    // NameSpaceService.listAll()). Handle both shapes defensively.
    const isMember =
        !!userId &&
        !!namespace.users?.some((entry: any) => {
            const candidateId = entry?._id ?? entry;
            return candidateId?.toString() === userId;
        });
    if (!isMember) {
        throw new Error(`Not authorized for namespace "${nameSpace}"`);
    }
}

/**
 * Require create ability in the target namespace, via the platform's CASL
 * AbilityFactory (single source of truth) (I3).
 */
export function assertCanWrite(
    abilityFactory: AbilityFactory,
    user: McpUser,
    nameSpace: string = NameSpaceEnum.Main
): void {
    const ability = abilityFactory.defineAbility(user as any, nameSpace);
    if (!ability.can(Action.Create, "all")) {
        throw new Error(`Not authorized to write in namespace "${nameSpace}"`);
    }
}

/**
 * Require a real user session for tools that attribute writes to `_id`.
 * M2M tokens have no `_id`; creating with `new Types.ObjectId(undefined)`
 * would silently mint a random id and corrupt attribution (I2).
 */
export function assertUserSession(user: McpUser): void {
    if (!user?._id) {
        throw new Error(
            "MCP write tools require a user session, not an M2M token"
        );
    }
}

export interface ToolResult {
    [key: string]: unknown;
    content: { type: "text"; text: string }[];
    isError?: boolean;
}

export function jsonResult(data: unknown): ToolResult {
    return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
}

/** Wraps a tool handler so failures become readable MCP errors, not crashes. */
export function safeTool<Args>(
    name: string,
    handler: (args: Args) => Promise<ToolResult>
): (args: Args) => Promise<ToolResult> {
    return async (args: Args) => {
        try {
            return await handler(args);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            logger.error(`Tool ${name} failed: ${message}`);
            return {
                isError: true,
                content: [{ type: "text", text: `${name} failed: ${message}` }],
            };
        }
    };
}
