import { imageFromUpload } from "./image.rules";

describe("image shared rules", () => {
    it("imageFromUpload maps the upload result onto the stored fields", () => {
        expect(
            imageFromUpload({
                DataHash: "a".repeat(32),
                Key: "a.png",
                Extension: "png",
                FileURL: "https://files.test/a.png",
            })
        ).toEqual({
            data_hash: "a".repeat(32),
            props: { key: "a.png", extension: "png" },
            content: "https://files.test/a.png",
        });
    });
});
