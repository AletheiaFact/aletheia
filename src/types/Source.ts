export type SourceType = {
    _id: string;
    href: string;
    nameSpace: string;
    data_hash?: string;
    props: {
        field: string;
        id: string;
        sup: number;
        targetText: string;
        textRange: number[];
    };
};
