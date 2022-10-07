export type Personality = {
    name: string;
    description: string;
    slug: string;
    id: string;
    image: string;
    avatar: string;
    wikipedia: string;
} & Partial<PersonalityExtraProps>;

type PersonalityExtraProps = {
    isDeleted: boolean;
    deletedAt: any;
    _id: string;
    __v: number;
    wikidata: string;
    claims: {
        _id: string;
        personality: string;
        latestRevision: {
            _id: string;
            title: string;
            id: string;
        };
    }[];
    stats: {
        total: number;
        reviews?: any[];
    };
};
