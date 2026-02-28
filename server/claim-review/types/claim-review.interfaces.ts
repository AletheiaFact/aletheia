import { Sentence } from "../../claim/types/sentence/schemas/sentence.schema";
import { User } from "../../entities/user.entity";
import { Personality } from "../../personality/mongo/schemas/personality.schema";
import { Report } from "../../report/schemas/report.schema";
import { Image } from "../../claim/types/image/schemas/image.schema";
import { ContentModelEnum } from "../../types/enums";

interface claim {
    contentModel: ContentModelEnum;
    date: Date;
    slug: string;
    title: string;
    claimId: string;
}

export interface IListAllQuery {
    isHidden?: boolean | string;
    nameSpace?: string;
    isDeleted?: boolean;
}

export interface IlistAll {
    page: number;
    pageSize: number;
    order: "asc" | "desc";
    query: IListAllQuery;
    latest?: boolean;
}


export interface ClaimReviewAggregated {
    _id?: string;
    nameSpace: string;
    isPartialReview: boolean;
    isHidden: boolean;
    isDeleted?: boolean;
    deletedAt?: Date | null;
    personality?: Personality
    usersId: User[];
    report: Report;
    target: claim;
    targetModel: string;
    data_hash: string;
    reportModel: string;
    date: Date;
    isPublished: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}

interface listAllData {
    content: Image | Sentence;
    personality?: Personality;
    reviewHref: string;
    claim: claim;
    report: Report;
}

export interface ClaimReviewList {
    data: listAllData[];
    total: number;
}

export interface listAllResponse {
    reviews: listAllData[];
    totalReviews: number;
    totalPages: number;
    page: number;
    pageSize: number;
}
