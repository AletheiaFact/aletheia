import { Db } from "mongodb";

export async function up(db: Db) {
  const historyCollection = db.collection("histories");

  const historiesFound = historyCollection.find({
    user: { $type: "string", $regex: "-" },
  });

  let count = 0;

  while (await historiesFound.hasNext()) {
    const history = await historiesFound.next();
    if (!history) continue;
    const oldUserValue = history.user as string;

    const newUser = {
      isM2M: true,
      clientId: oldUserValue,
      subject: "chatbot-service",
      scopes: ["read", "write"],
      role: { main: "integration" },
      namespace: "main",
    };

    await historyCollection.updateOne(
      { _id: history._id },
      { $set: { user: newUser } }
    );

    count++;
  }

  console.log(`Migration complete. Updated ${count} documents.`);
}

export async function down(db: Db) {
  const historyCollection = db.collection("histories");

  const historiesFound = historyCollection.find({
    "user.isM2M": true,
    "user.subject": "chatbot-service",
    "user.clientId": { $exists: true }
  });

  let count = 0;

  while (await historiesFound.hasNext()) {
    const history = await historiesFound.next();
    if (!history) continue;
    const clientId = history.user.clientId;

    await historyCollection.updateOne(
      { _id: history._id },
      { $set: { user: clientId } }
    );

    count++;
  }

  console.log(`Rollback complete. Reverted ${count} documents.`);
}
