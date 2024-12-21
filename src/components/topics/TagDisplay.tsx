import { IconButton } from "@mui/material";
import React from "react";
import colors from "../../styles/colors";
import { Edit, AddOutlined } from "@mui/icons-material";
import TagsList from "./TagsList";
import { useAtom } from "jotai";
import { isUserLoggedIn } from "../../atoms/currentUser";
import TagDisplayStyled from "./TagDisplay.style";

interface ITagDisplay {
    handleClose: (removedTopicValue: any) => Promise<void>;
    tags: any[];
    setShowTopicsForm: (topicsForm: any) => void;
}

const TagDisplay = ({ handleClose, tags, setShowTopicsForm }: ITagDisplay) => {
    const [isLoggedIn] = useAtom(isUserLoggedIn);

    return (
        <TagDisplayStyled>
            <TagsList
                tags={tags}
                editable={isLoggedIn}
                handleClose={handleClose}
            />

            {isLoggedIn && (
                <IconButton
                    onClick={() => setShowTopicsForm((prev: boolean) => !prev)}
                    style={{
                        color: colors.primary,
                    }}
                >
                    {tags.length ? <Edit fontSize="small"/> : <AddOutlined fontSize="small"/>}
                </IconButton>
            )}
        </TagDisplayStyled>
    );
};

export default TagDisplay;
