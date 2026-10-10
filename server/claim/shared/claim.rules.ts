import slugify from "slugify";
import { ContentModelEnum } from "../../types/enums";

export function deriveClaimSlug(title: string): string {
    return slugify(title, { lower: true, strict: true });
}

export function getClaimContent(claim: any) {
    if (
        claim.contentModel === ContentModelEnum.Speech ||
        claim.contentModel === ContentModelEnum.Unattributed
    ) {
        return claim.content[0].content;
    }
    return claim.content[0];
}

export function transformContentObject(
    claimContent: any,
    reviews: any[],
    reviewTasks: any[]
) {
    if (!claimContent || (reviews.length <= 0 && reviewTasks.length <= 0)) {
        return claimContent;
    }

    const processReview = (sentence: any, classification: any) => ({
        ...sentence,
        props: {
            ...sentence.props,
            classification,
        },
    });

    if (claimContent.type === ContentModelEnum.Image) {
        const claimReview = reviews.find(
            (review: any) => review._id.data_hash === claimContent.data_hash
        );
        if (claimReview) {
            claimContent.props = {
                ...claimContent.props,
                classification: claimReview._id.classification[0],
            };
        }
    } else {
        claimContent.forEach((paragraph: any, paragraphIndex: number) => {
            claimContent[paragraphIndex].content = paragraph.content.map(
                (sentence: any) => {
                    const claimReview = reviews.find(
                        (review: any) =>
                            review?._id.data_hash === sentence.data_hash
                    );
                    if (claimReview) {
                        return processReview(
                            sentence,
                            claimReview._id.classification[0]
                        );
                    }
                    const inProgress = reviewTasks.some(
                        (task: any) => task?.data_hash === sentence.data_hash
                    );
                    if (inProgress) {
                        return processReview(sentence, "in-progress");
                    }
                    return sentence;
                }
            );
        });
    }

    return claimContent;
}

export function annotateClaimContent(
    claim: any,
    reviews: any[],
    reviewTasks: any[]
) {
    if (!claim?.content) return claim;
    if (claim.contentModel === ContentModelEnum.Debate) {
        claim.content.content = claim.content.content.map((speech: any) => ({
            ...speech,
            content: transformContentObject(
                speech.content,
                reviews,
                reviewTasks
            ),
        }));
    } else {
        claim.content = transformContentObject(
            claim.content,
            reviews,
            reviewTasks
        );
    }
    return claim;
}

export function calculateOverallStats(claim: any) {
    let totalClaims = 0;
    let totalClaimsReviewed = 0;

    if (claim?.content) {
        if (claim?.contentModel === ContentModelEnum.Image) {
            totalClaims += 1;
            if (claim.content.props.classification) {
                totalClaimsReviewed++;
            }
        } else if (claim?.content.length > 0) {
            claim.content.forEach((p: any) => {
                totalClaims += p.content.length;
                p.content.forEach((sentence: any) => {
                    if (sentence.props.classification) {
                        totalClaimsReviewed++;
                    }
                });
            });
        }
    }
    return { totalClaims, totalClaimsReviewed };
}
