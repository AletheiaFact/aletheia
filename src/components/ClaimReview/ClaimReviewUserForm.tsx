import { UserOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import React, { useState } from 'react'
import InputSearch from '../Form/InputSearch'
import SearchResult from '../SearchResult'
import api from "../../api/user";
import { useTranslation } from 'next-i18next'

const ClaimReviewUserForm = ({ sentenceHash, send }) => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [searchName, setSearchName] = useState("")

    const handleInputSearch = async (name) => {
        setSearchName(name)
        const userSearchResults = await api.getUsers(name, t)
        setUsers(userSearchResults)
    }

    const handleSearchClick = (userId) => {
        send("ASSIGN_USER", { userId, sentence_hash: sentenceHash, t })
    }


    return (
        <>
            <InputSearch
                placeholder={t("claimReviewForm:assignUser")}
                callback={handleInputSearch}
            />
            {users &&
                users.map(user =>
                    <SearchResult
                        key={user._id}
                        handleOnClick={() => handleSearchClick(user._id)}
                        avatar={<Avatar size={30} icon={<UserOutlined />} />}
                        name={user.name}
                        searchName={searchName}
                    />)
            }
        </>

    )
}

export default ClaimReviewUserForm
