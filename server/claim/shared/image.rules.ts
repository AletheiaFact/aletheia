import type { ImageUpload } from "../../interfaces/image.service.interface";

/** Maps a `POST api/image` upload result onto the stored image fields. */
export function imageFromUpload(upload: ImageUpload) {
    return {
        data_hash: upload.DataHash,
        props: { key: upload.Key, extension: upload.Extension },
        content: upload.FileURL,
    };
}
