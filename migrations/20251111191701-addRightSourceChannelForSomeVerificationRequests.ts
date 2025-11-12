import { Db } from "mongodb";

export async function up(db: Db) {
  const filter = {
    heardFrom: { $regex: /^Automated Monitoring -/i },
    sourceChannel: { $ne: "automated_monitoring" },
  };

  const update = {
    $set: { sourceChannel: "automated_monitoring" },
  };

  const result = await db
    .collection("verificationrequests")
    .updateMany(filter, update);

  console.log(`✅ Updated ${result.modifiedCount} verification requests`);
}

export async function down(db: Db) {
  const filter = {
    heardFrom: { $regex: /^Automated Monitoring -/i },
    sourceChannel: "automated_monitoring",
  };

  const update = { $set: { sourceChannel: "instagram" } };

  const result = await db
    .collection("verificationrequests")
    .updateMany(filter, update);

  console.log(`⬅️ Reverted ${result.modifiedCount} verification requests`);
}
