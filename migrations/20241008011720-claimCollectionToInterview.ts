import md5 from "md5";
import { Db } from "mongodb";
const ObjectId = require("mongodb").ObjectID;

export async function up(db: Db) {
    try {
        const claimCollectionCursor = await db
            .collection("claimcollections")
            .find();
        await db.collection("logs").insertOne({
            message: `start migration-up`,
            date: new Date(),
            context: "migration-up",
            type: "info",
        });
        while (await claimCollectionCursor.hasNext()) {
            const doc = await claimCollectionCursor.next();
            // create interview, claim and claim revision with claim collection basic data
            let hashString = doc.personalities.join(" ");
            hashString += ` ${doc.title} ${doc.date.toString()}`;
            const data_hash = md5(hashString);
            const interview = await db.collection("interviews").insertOne({
                isLive: doc.isLive,
                type: "interview",
                data_hash,
            });

            const claim = await db.collection("claims").insertOne({
                slug: doc.slug,
                personalities: doc.personalities,
                isDeleted: false,
                deletedAt: null,
            });

            const claimRevision = await db
                .collection("claimrevisions")
                .insertOne({
                    claimId: claim.insertedId,
                    title: doc.title,
                    slug: doc.slug,
                    contentModel: "interview",
                    date: doc.date,
                    personalities: doc.personalities,
                    contentId: interview.insertedId,
                });
            await db.collection("claims").updateOne(
                { _id: claim.insertedId },
                {
                    $set: { latestRevision: claimRevision.insertedId },
                }
            );

            /* For each claimId in editorContentObject get the claim revision and then the speech
            replace the editorContentObject claimId with the speechId
            add the personality to the speech and add the speech to the interview,
            delete the claim and claim revision
            */
            const editorContentObject = doc.editorContentObject;
            for (let i = 0; i < editorContentObject.content.length; i++) {
                if (
                    editorContentObject.content[i].type === "editor-claim-card-interview"
                ) {
                    const oldClaimRevision = await db
                        .collection("claimrevisions")
                        .findOne({
                            claimId: ObjectId(
                                editorContentObject.content[i].attrs.claimId
                            ),
                        });
                    const speechId = ObjectId(oldClaimRevision.contentId);

                    delete editorContentObject.content[i].attrs.claimId;
                    editorContentObject.content[i].attrs.speechId =
                        speechId.toString();

                    await db.collection("speeches").updateOne(
                        { _id: speechId },
                        {
                            $set: {
                                personality:
                                    oldClaimRevision.personalities?.[0] ||
                                    oldClaimRevision.personality ||
                                    "",
                            },
                        }
                    );

                    await db
                        .collection("interviews")
                        .updateOne(
                            { _id: interview.insertedId },
                            { $push: { content: speechId } }
                        );

                    await db
                        .collection("claimreviews")
                        .updateMany(
                            { claim: oldClaimRevision.claimId },
                            { $set: { claim: claim.insertedId } }
                        );
                    await db
                        .collection("claimreviewtasks")
                        .updateMany(
                            { claim: oldClaimRevision.claimId.toString() },
                            { $set: { claim: claim.insertedId.toString() } }
                        );

                    await db
                        .collection("claims")
                        .deleteOne({ _id: oldClaimRevision.claimId });
                    await db
                        .collection("claimrevisions")
                        .deleteOne({ _id: oldClaimRevision._id });
                }
            }

            await db.collection("editors").insertOne({
                reference: interview.insertedId,
                editorContentObject,
            });

            //update sources
            const sourceCursor = await db
                .collection("sources")
                .find({ targetId: doc._id });
            while (await sourceCursor.hasNext()) {
                const source = await sourceCursor.next();
                const targetId = source.targetId.map((target) => {
                    return target.toString() === doc._id.toString()
                        ? claim.insertedId
                        : target;
                });
                await db.collection("sources").updateOne(
                    { _id: source._id },
                    {
                        $set: { targetId },
                    }
                );
            }

            // delete the claim collection
            await db.collection("claimcollections").deleteOne({ _id: doc._id });
        }
    } catch (error) {
        await db.collection("logs").insertOne({
            message: error.message,
            date: new Date(),
            context: "migration-up",
            type: "error",
        });
    }
}

export async function down(db: Db) {
    try {
        await db.collection("logs").insertOne({
            message: `start migration-down`,
            date: new Date(),
            context: "migration-down",
            type: "info",
        });
        const interviewCursor = await db.collection("interviews").find();
        while (await interviewCursor.hasNext()) {
            const interview = await interviewCursor.next();
            const editor = await db
                .collection("editors")
                .findOne({ reference: interview._id });

            const claimRevision = await db
                .collection("claimrevisions")
                .findOne({
                    contentId: interview._id,
                });

            const claim = await db.collection("claims").findOne({
                latestRevision: claimRevision._id,
            });

            const editorContentObject = editor.editorContentObject;
            if (editorContentObject?.content) {
                for (let i = 0; i < editorContentObject.content.length; i++) {
                    if (
                        editorContentObject.content[i].type ===
                        "editor-claim-card-interview"
                    ) {
                        const speech = await db.collection("speeches").findOne({
                            _id: ObjectId(
                                editorContentObject.content[i].attrs.speechId
                            ),
                        });
                        const personalityId =
                            editorContentObject.content[i].attrs.personalityId;

                        const newClaim = await db
                            .collection("claims")
                            .insertOne({
                                slug: claimRevision.slug,
                                personalities: [ObjectId(personalityId)],
                                isDeleted: false,
                                deletedAt: null,
                            });
                        const newClaimRevision = await db
                            .collection("claimrevisions")
                            .insertOne({
                                claimId: newClaim.insertedId,
                                contentModel: "Speech",
                                personalities: [ObjectId(personalityId)],
                                title: claimRevision.title,
                                date: claimRevision.date,
                                slug: claimRevision.slug,
                                contentId: speech._id,
                            });
                        await db.collection("claims").updateOne(
                            { _id: newClaim.insertedId },
                            {
                                $set: {
                                    latestRevision: newClaimRevision.insertedId,
                                },
                            }
                        );

                        editorContentObject.content[i].attrs.claimId =
                            newClaim.insertedId.toString();
                        delete editorContentObject.content[i].attrs.speechId;
                    }
                }
            }

            const claimCollection = await db
                .collection("claimcollections")
                .insertOne({
                    isHidden: false,
                    isLive: interview.isLive,
                    personalities: claim.personalities,
                    title: claimRevision.title,
                    date: claimRevision.date,
                    slug: claimRevision.slug,
                    editorContentObject: editor.editorContentObject,
                });

            const reviews = await db
                .collection("claimreviews")
                .find({ claim: claim._id });
            reviews.forEach(async (review) => {
                db.collection("sentences")
                    .findOne({ data_hash: review.data_hash })
                    .then(async (sentence) => {
                        if (!sentence) return null;

                        return db
                            .collection("paragraphs")
                            .findOne({ content: sentence._id });
                    })
                    .then(async (paragraph) => {
                        if (!paragraph) return null;
                        return db
                            .collection("speeches")
                            .findOne({ content: paragraph._id });
                    })
                    .then(async (speech) => {
                        if (!speech) return null;
                        return db
                            .collection("claimrevisions")
                            .findOne({ contentId: speech._id });
                    })
                    .then(async (revision) => {
                        await db
                            .collection("claimreviews")
                            .updateOne(
                                { _id: review._id },
                                { $set: { claim: revision.claimId } }
                            );
                        await db.collection("claimreviewTasks").updateOne(
                            { data_hash: review.data_hash },
                            {
                                $set: {
                                    "machine.context.claimReview.claim":
                                        revision.claimId.toString(),
                                },
                            }
                        );
                    })
                    .catch(async (error) => {
                        await db.collection("logs").insertOne({
                            message: error.message,
                            date: new Date(),
                            context: "migration-down reviews",
                            type: "error",
                        });
                    });
            });

            await db.collection("editors").deleteOne({ _id: editor._id });
            await db.collection("interviews").deleteOne({ _id: interview._id });
            await db.collection("claims").deleteOne({ _id: claim._id });
            await db.collection("claimrevisions").deleteOne({
                _id: claimRevision._id,
            });

            //update sources
            const sourceCursor = await db
                .collection("sources")
                .find({ targetId: claim._id });
            while (await sourceCursor.hasNext()) {
                const source = await sourceCursor.next();
                const targetId = source.targetId.map((target) => {
                    return target.toString() === claim._id.toString()
                        ? claimCollection.insertedId
                        : target;
                });
                await db.collection("sources").updateOne(
                    { _id: source._id },
                    {
                        $set: { targetId },
                    }
                );
            }
        }

        await db.collection("logs").insertOne({
            message: "finish migration-down",
            date: new Date(),
            context: "migration-down reviews",
            type: "info",
        });
    } catch (error) {
        await db.collection("logs").insertOne({
            message: error.message,
            date: new Date(),
            context: "migration-down",
            type: "error",
        });
    }
}
