import { Button, Col } from "antd";
import React from "react";
import colors from "../../styles/colors";
import { EditFilled, PlusOutlined } from "@ant-design/icons";
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
                <Button
                    onClick={() => setShowTopicsForm((prev: boolean) => !prev)}
                    style={{
                        padding: "5px",
                        background: "none",
                        border: "none",
                        fontSize: 16,
                        color: colors.bluePrimary,
                    }}
                >
                    {tags.length ? <EditFilled /> : <PlusOutlined />}
                </Button>
            )}
        </TagDisplayStyled>
    );
};

export default TagDisplay;
