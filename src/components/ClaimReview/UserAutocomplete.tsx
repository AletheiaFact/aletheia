import React from "react";
import api from "../../api/user";
import { useTranslation } from "next-i18next";
import SelectUser from "./form/SelectUser";

const UserAutocomplete = ({ placeholder, onChange, dataCy, fieldName }) => {
    const { t } = useTranslation();

    const fetchUserList = async (name) => {
        const userSearchResults = await api.getUsers(name, t);
        return userSearchResults.map((user) => ({
            label: user.name,
            value: user._id,
        }));
    };

    const fetchTopicList = async () => {
        console.log("vamo la");
    };

    return (
        <>
            {fieldName && (
                <SelectUser
                    name={fieldName}
                    fetchOptions={
                        fieldName === "usersId" ? fetchUserList : fetchTopicList
                    }
                    placeholder={placeholder}
                    onChange={onChange}
                    data-cy={dataCy}
                    style={{ width: "100%" }}
                />
            )}
        </>
    );
};

export default UserAutocomplete;
