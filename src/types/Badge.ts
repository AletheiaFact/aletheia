export type Badge = {
    name: string;
    description: string;
    image: {
        type: string;
        _id: string;
        data_hash: string;
        props: {
            key: string;
            extension: string;
        };
        content: string;
    };
    created_at: string;
    _id: string;
    users: any[];
};
