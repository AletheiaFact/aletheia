import React from 'react'
import api from "../../api/user";
import { useTranslation } from 'next-i18next'
import SelectUser from './form/SelectUser'

const UserAutocomplete = ({ placeholder, onChange, dataCy }) => {
    const { t } = useTranslation();

    const fetchUserList = async (name) => {
        const userSearchResults = await api.getUsers(name, t)
        return userSearchResults.map(user => ({
            label: user.name,
            value: user._id
        }))
    }

    return (
        <SelectUser
            fetchOptions={fetchUserList}
            placeholder={placeholder}
            onChange={onChange}
            data-cy={dataCy}
            style={{ width: '100%' }}
        />
    )
}

export default UserAutocomplete
