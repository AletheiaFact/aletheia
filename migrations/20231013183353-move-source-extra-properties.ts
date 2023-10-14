import { Db } from "mongodb";

export async function up(db: Db) {
    const sourcesCursor = await db.collection("sources").find();

    while (await sourcesCursor.hasNext()) {
        const source = await sourcesCursor.next();
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

        await db.collection("sources").update({ _id: source._id }, updateData);
    }
}
