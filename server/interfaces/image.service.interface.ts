import type { IImage } from "./claim-content.interface";

/** An upload result from `POST api/image` (file-management). */
export type ImageUpload = {
    DataHash?: string;
    Key?: string;
    Extension?: string;
    FileURL?: string;
    [key: string]: any;
};

export type IImageService = {
    create(image: ImageUpload, claimRevisionId?: any): Promise<IImage>;
    getById(id: string): Promise<IImage | null>;
    getByDataHash(data_hash: string): Promise<IImage>;
    updateImageWithTopics(
        topics: any[],
        data_hash: string
    ): Promise<IImage | null>;
    getHashesByTopic(topicId: string): Promise<string[]>;
};
