import { INestApplication, NotFoundException } from "@nestjs/common";
import { ContextIdFactory } from "@nestjs/core";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { CreateClaimSchema } from "../claim/dto/claim.dto";
import { deriveClaimSlug } from "../claim/shared/claim.rules";
import type { IClaimService } from "../interfaces/claim.service.interface";
import type { IPersonalityService } from "../interfaces/personality.service.interface";
import { ContentModelEnum } from "../types/enums";
import { UsersService } from "../users/users.service";
import { seedClaims } from "./seed-data/claims";
import seedPersonalities from "./seed-data/personalities.json";
import { seedReviewQueue } from "./seed-queue";
import { seedPublishedReviews } from "./seed-reviews";

// The API body minus the captcha, which a seed has no way to solve.
const SeedClaimSchema = CreateClaimSchema.omit({ recaptcha: true });

/**
 * Seeds sample personalities, speech claims, published fact-checks and the
 * review queue (enabled by SEED_SAMPLE_DATA=true). Every step looks its data
 * up first, so re-runs add nothing.
 */
export async function seedSampleData(
    app: INestApplication,
    seedUsers: Array<{ email: string; password: string }>,
    log: (message: string) => void
) {
    if (process.env.NODE_ENV === "production") {
        log("Sample data skipped: refusing to seed in production");
        return;
    }
    // Request-scoped services read the acting user from the request.
    const req: Record<string, any> = { params: {}, query: {}, headers: {} };
    const contextId = ContextIdFactory.create();
    app.registerRequestByContextId(req, contextId);
    const resolve = <T>(token: any) =>
        app.resolve<T>(token, contextId, { strict: false });

    const userService = await resolve<UsersService>(UsersService);
    const author = await userService.getByEmail(seedUsers[0].email);
    if (!author) {
        log(`Sample data skipped: user ${seedUsers[0].email} does not exist`);
        return;
    }
    req.user = author.toObject();

    const personalityService = await resolve<IPersonalityService>(
        "PersonalityService"
    );
    const claimService = await resolve<IClaimService>("ClaimService");
    const claimReviewService = await resolve<ClaimReviewService>(
        ClaimReviewService
    );

    // findOrCreatePersonality matches by wikidata id and makes no Wikidata call.
    const personalityIds = new Map<string, string>();
    for (const personality of seedPersonalities) {
        const saved = await personalityService.findOrCreatePersonality({
            name: personality.name,
            wikidata: {
                id: personality.wikidata,
                description: personality.description,
            },
        });
        personalityIds.set(personality.wikidata, String(saved._id));
    }
    log(`${personalityIds.size} personalities seeded`);

    const claims = new Map<
        string,
        { claimId: string; personalityId: string }
    >();
    let created = 0;
    for (const { personality, ...seedClaim } of seedClaims) {
        const personalityId = personalityIds.get(personality);
        if (!personalityId) {
            log(`Claim skipped, unknown personality: "${seedClaim.title}"`);
            continue;
        }
        let claim = await claimService
            .getByPersonalityIdAndClaimSlug(
                personalityId,
                deriveClaimSlug(seedClaim.title),
                undefined,
                false
            )
            .catch((e) => {
                if (e instanceof NotFoundException) return null;
                throw e;
            });
        if (!claim) {
            const parsed = SeedClaimSchema.safeParse({
                ...seedClaim,
                contentModel: ContentModelEnum.Speech,
                nameSpace: NameSpaceEnum.Main,
                personalities: [personalityId],
            });
            if (!parsed.success) {
                log(`Claim skipped, invalid: "${seedClaim.title}"`);
                continue;
            }
            claim = await claimService.create(parsed.data);
            created++;
        }
        claims.set(seedClaim.title.trim(), {
            claimId: String(claim._id),
            personalityId,
        });
    }
    log(`${created} claims created, ${claims.size - created} already there`);

    const deps = {
        app,
        contextId,
        log,
        claimService,
        claimReviewService,
        claims,
    };
    await seedPublishedReviews({ ...deps, authorId: String(author._id) });
    await seedReviewQueue({ ...deps, userService, seedUsers });
}
