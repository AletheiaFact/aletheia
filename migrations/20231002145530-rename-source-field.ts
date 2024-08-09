import { Db } from "mongodb";

export async function up(db: Db) {
    return;
    // migrations not needed
    await db
        .collection("sources")
        .updateMany({}, { $rename: { link: "href" } });
}
export async function down(db: Db) {
    await db
        .collection("sources")
        .updateMany({}, { $rename: { href: "link" } });
}
