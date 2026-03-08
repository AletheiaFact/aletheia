import { Types } from "mongoose";

const commentA_Id = new Types.ObjectId();
const commentB_Id = new Types.ObjectId();
const commentC_Id = new Types.ObjectId();
const commentD_Id = new Types.ObjectId();

export const mockCommentA = {
    _id: commentA_Id,
    content: "Review comment A",
    type: "reviewComment",
};

export const mockCommentB = {
    _id: commentB_Id,
    content: "Review comment B",
    type: "reviewComment",
};

export const mockCommentC = {
    _id: commentC_Id,
    content: "Cross-checking comment C",
    type: "crossCheckingComment",
};

export const mockCommentD = {
    _id: commentD_Id,
    content: "Cross-checking comment D",
    type: "crossCheckingComment",
};

export const mockReviewTaskUnassigned = {
    _id: new Types.ObjectId(),
    data_hash: "hash-unassigned",
    machine: {
        value: "unassigned",
        context: {
            reviewData: {
                usersId: [],
                summary: "",
                classification: "",
                reviewerId: null,
                crossCheckerId: null,
                reviewComments: [],
                crossCheckingComments: [],
            },
            review: {
                personality: "",
                usersId: "",
                targetId: "",
                isPartialReview: false,
            },
        },
    },
};

export const mockReviewTaskWithComments = {
    _id: new Types.ObjectId(),
    data_hash: "hash-with-comments",
    machine: {
        value: "assigned",
        context: {
            reviewData: {
                usersId: [],
                summary: "Test summary",
                classification: "true",
                reviewerId: new Types.ObjectId(),
                crossCheckerId: new Types.ObjectId(),
                reviewComments: [mockCommentA, mockCommentB],
                crossCheckingComments: [mockCommentC, mockCommentD],
            },
            review: {
                personality: "",
                usersId: "",
                targetId: "",
                isPartialReview: false,
            },
        },
    },
};

export const mockReviewTaskPublished = {
    _id: new Types.ObjectId(),
    data_hash: "hash-published",
    machine: {
        value: "published",
        context: {
            reviewData: {
                usersId: [],
                summary: "Published review",
                classification: "true",
                reviewerId: new Types.ObjectId(),
                crossCheckerId: null,
                reviewComments: [mockCommentA],
                crossCheckingComments: [],
            },
            review: {
                personality: "",
                usersId: "",
                targetId: "",
                isPartialReview: false,
            },
        },
    },
};

type MockedModel = jest.Mock & {
    findOne: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findOneAndUpdate: jest.Mock;
    aggregate: jest.Mock;
};

export const mockReviewTaskModel = jest.fn() as MockedModel;

mockReviewTaskModel.findOne = jest.fn();
mockReviewTaskModel.findById = jest.fn();
mockReviewTaskModel.findByIdAndUpdate = jest.fn();
mockReviewTaskModel.findOneAndUpdate = jest.fn();
mockReviewTaskModel.aggregate = jest.fn();
