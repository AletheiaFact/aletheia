import { UploadFile } from "../components/ImageUpload";
import { User } from "./User";

export interface Image {
    type: string;
    _id: string;
    data_hash: string;
    props: {
        key: string;
        extension: string;
    };
    content: string;
};

export interface Badge {
    name: string;
    description: string;
    image: Image
    created_at: string;
    _id: string;
    users: any[];
};

export interface IDynamicBadgesForm {
    badges: Badge;
    onSubmit: (value: IBadgeData) => void;
    isLoading: boolean;
    isDrawerOpen:boolean;
    onClose: () => void;
}

export interface IBadgeData {
    name: string;
    description: string;
    imageField: UploadFile[];
    usersId: string[];
}

export interface IBadgeProps {
    name: string;
    description: string;
    image: Image;
    users: User[];
}
