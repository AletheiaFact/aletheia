export interface IClaimRevision {
    _id?: any;
    id?: any;
    title: string;
    slug: string;
    contentId?: any;
    contentModel: string;
    date: Date;
    claimId: any;
    personalities?: any[];
    content?: any;
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
}
