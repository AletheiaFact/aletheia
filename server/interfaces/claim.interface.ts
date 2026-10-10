export interface IClaim {
    _id?: any;
    id?: any;
    slug: string;
    personalities?: any[];
    latestRevision?: any;
    isHidden: boolean;
    nameSpace: string;
    group?: any;
    isDeleted?: boolean;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
}
