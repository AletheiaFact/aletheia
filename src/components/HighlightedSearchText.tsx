import React from "react";

const HighlightedSearchText = ({ text = '', highlight = '' }) => {
    if (!highlight?.trim()) {
        return <span>{text}</span>
    }

    const pattern = new RegExp(`(${highlight})`, 'gi')
    const parts = text.split(pattern)

    return (
        <span>
            {parts.filter(part => part).map((part, i) => (
                pattern.test(part) ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
            ))}
        </span>
    )
}


export default HighlightedSearchText
