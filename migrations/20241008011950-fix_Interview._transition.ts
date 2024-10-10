import md5 from "md5";
import { Db } from "mongodb";
const ObjectId = require("mongodb").ObjectID;

export async function up(db: Db) {
    try {
        await db.collection("logs").insertOne({
            message: `start migration-up`,
            date: new Date(),
            context: "migration-up 20230425092159-fix_interview_transition.ts",
            type: "info",
        });
        const interviewsCursor = await db.collection("interviews").find();
        while (await interviewsCursor.hasNext()) {
            const interview = await interviewsCursor.next();
            const { _id: interviewId } = interview;

            const claimRevision = await db
                .collection("claimrevisions")
                .findOne({ contentId: ObjectId(interviewId) });

            if (claimRevision) {
                const claimCollection = await db
                    .collection("claimcollections")
                    .findOne({ slug: claimRevision.slug });

                if (claimCollection) {
                    const claimCollectionContent =
                        claimCollection?.editorContentObject?.content;
                    const claimIds = claimCollectionContent
                        ?.map((contentNode: any) => {
                            if (contentNode.type === "editor-claim-card-interview") {
                                return contentNode.attrs.claimId;
                            }
                        })
                        .filter((claimId: any) => claimId);

                    const contentToChange = (
                        await Promise.all(
                            claimIds.map(async (claimId: any) => {
                                const claim = await db
                                    .collection("claims")
                                    .findOne({ _id: ObjectId(claimId) });
                                if (claim) {
                                    const { latestRevision } = claim;
                                    const { contentId } = await db
                                        .collection("claimrevisions")
                                        .findOne({
                                            _id: ObjectId(latestRevision),
                                        });
                                    await db.collection("speeches").updateOne(
                                        { _id: ObjectId(contentId) },
                                        {
                                            $set: {
                                                personality:
                                                    claim.personalities[0],
                                            },
                                        }
                                    );
                                    return contentId;
                                }
                            })
                        )
                    ).filter((contentId: any) => contentId);

                    if (
                        Array.isArray(contentToChange) &&
                        contentToChange.length > 0
                    ) {
                        await db
                            .collection("interviews")
                            .updateOne(
                                { _id: ObjectId(interviewId) },
                                { $set: { content: contentToChange } }
                            );
                        claimIds.forEach(async (claimId) => {
                            await db
                                .collection("claims")
                                .updateOne(
                                    { _id: ObjectId(claimId) },
                                    { $set: { isDeleted: true } }
                                );
                            // We will lose the old claimId in the claimreviews collection, but we can't do anything about that, the down function won't work either
                            await db
                                .collection("claimreviews")
                                .updateMany(
                                    { claim: ObjectId(claimId) },
                                    {
                                        $set: {
                                            claim: claimRevision.claimId,
                                            isDeleted: true,
                                        },
                                    }
                                );
                        });
                    }
                }
            }
        }
    } catch (error) {
        await db.collection("logs").insertOne({
            message: error.message,
            date: new Date(),
            context: "migration-up 20230425092159-fix_interview_transition.ts",
            type: "error",
        });
        throw error;
    }
}

export async function down(db: Db) {
    try {
        await db.collection("logs").insertOne({
            message: `start migration-down`,
            date: new Date(),
            context: "migration-down 20230425092159-fix_interview_transition.ts",
            type: "info",
        });

        const interviewsCursor = await db.collection("interviews").find();
        while (await interviewsCursor.hasNext()) {
            const interview = await interviewsCursor.next();
            const { _id: interviewId } = interview;
            const claimRevision = await db
                .collection("claimrevisions")
                .findOne({ contentId: ObjectId(interviewId) });

            if (claimRevision) {
                const claimCollection = await db
                    .collection("claimcollections")
                    .findOne({ slug: claimRevision.slug });
                if (claimCollection) {
                    const claimCollectionContent =
                        claimCollection?.editorContentObject?.content;
                    const claimIds = claimCollectionContent
                        ?.map((contentNode: any) => {
                            if (contentNode.type === "editor-claim-card-interview") {
                                return contentNode.attrs.claimId;
                            }
                        })
                        .filter((claimId: any) => claimId);
                    // Just set the content to an empty array
                    await db
                        .collection("interviews")
                        .updateOne(
                            { _id: ObjectId(interviewId) },
                            { $set: { content: [] } }
                        );

                    // Set claims back to not deleted
                    claimIds.forEach(async (claimId) => {
                        await db
                            .collection("claims")
                            .updateOne(
                                { _id: ObjectId(claimId) },
                                { $set: { isDeleted: false } }
                            );
                        await db
                            .collection("claimreviews")
                            .updateMany(
                                { claim: ObjectId(claimId) },
                                {
                                    $set: {
                                        claim: claimRevision.claimId,
                                        isDeleted: false,
                                    },
                                }
                            );
                    });
                }
            }
        }
    } catch (error) {
        await db.collection("logs").insertOne({
            message: error.message,
            date: new Date(),
            context: "migration-down 20230425092159-fix_interview_transition.ts",
            type: "error",
        });
        throw error;
    }
}
