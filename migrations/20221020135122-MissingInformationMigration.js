module.exports = {
    async up(db, client) {
        const claimreviewsCursor = await db.collection("claimreviews").find();

        while (await claimreviewsCursor.hasNext()) {
            const doc = await claimreviewsCursor.next();

            if (doc.isHidden === undefined) {
                await db
                    .collection("claimreviews")
                    .updateOne({ _id: doc._id }, { $set: { isHidden: false } });
            }
        }
    },

    async down(db, client) {},
};
