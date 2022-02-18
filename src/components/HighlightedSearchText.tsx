import React from "react";


const HighlightedText = ({ text = '', highlight = '' }) => {
    if (!highlight?.trim()) {
        return <span>{text}</span>
    }

    const regex = new RegExp(`(${highlight})`, 'gi')
    const parts = text.split(regex)
    return (
        <span>
            {parts.filter(part => part).map((part, i) => (
                regex.test(part) ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
            ))}
        </span>
    )
}


export default HighlightedText
