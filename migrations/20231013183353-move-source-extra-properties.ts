import { Db } from "mongodb";

export async function up(db: Db) {
    // migrations not needed
    const sourcesCursor = await db.collection("sources").find();

    while (await sourcesCursor.hasNext()) {
        const source = await sourcesCursor.next();
        if (!source) {
            continue;
        }
        const { _id, user, href, targetId } = source;

        const updateData: any = {
            _id,
            targetId,
            href,
            user,
            props: {},
        };

        const copyPropsIfExist = (key) => {
            if (source[key] || source.props?.[key]) {
                updateData.props[key] = source[key] || source.props[key];
            }
        };

        copyPropsIfExist("targetReference");
        copyPropsIfExist("targetText");
        copyPropsIfExist("textRange");

        await db.collection("sources").updateOne({ _id: source?._id }, { $set: updateData });
    }
}
