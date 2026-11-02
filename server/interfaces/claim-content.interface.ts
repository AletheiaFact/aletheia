export interface ISentence {
    _id?: any;
    id?: any;
    type: string;
    data_hash: string;
    props: Record<string, any>;
    content: string;
    topics?: any[];
    claimRevisionId?: any;
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
}

export interface IParagraph {
    _id?: any;
    id?: any;
    type: string;
    data_hash: string;
    props: Record<string, any>;
    content: any[];
    claimRevisionId?: any;
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
}

export interface ISpeech {
    _id?: any;
    id?: any;
    type: string;
    content: any[];
    personality?: any;
    claimRevisionId?: any;
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
}

export interface IUnattributed {
    _id?: any;
    id?: any;
    type: string;
    content: any[];
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: any;
}
