import React from "react"

const LocalizedDate = ({ date, showTime = false }) => {
    date = new Date(date)
    const localizedDate = date.toLocaleDateString()
    const localizedTime = date.toLocaleTimeString()
    return (
        <strong>{localizedDate}{showTime && ` - ${localizedTime}`}</strong>
    )
}

export default LocalizedDate
