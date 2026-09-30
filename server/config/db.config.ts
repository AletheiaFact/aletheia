export default {
    type: (process.env.DB_TYPE ?? "mongodb") as "mongodb" | "postgres",
};
