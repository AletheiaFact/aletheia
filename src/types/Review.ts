export interface Review {
    personality: string;
    usersId: string[];
    isPartialReview: boolean;
    crossCheckerId: string;
    reviewerId: string
}

export interface SourceProps {
    id?: string;
    field?: string | null;
    targetText?: string | null;
    textRange?: number[] | string | null;
};

export interface ReviewSource {
    id?: string;
    href?: string;
    props?: SourceProps;
    field?: string | null;
};

export type ReviewSourceInput = ReviewSource | string;
