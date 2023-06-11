export default function ({ localField = "data_hash", as }) {
    return {
        $lookup: {
            from: "claimreviews",
            localField,
            foreignField: "data_hash",
            as,
        },
    };
}
