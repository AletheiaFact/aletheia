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
  /**
   * NO-OP: This migration is irreversible via script.
   * Rolling back would incorrectly force all sourceChannel values to "instagram",
   * potentially overwriting original historical data.
   */
  console.warn('⚠️ Down migration: No action taken (Data correction is irreversible via script).');
}
