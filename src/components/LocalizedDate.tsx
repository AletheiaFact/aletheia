import React from "react";

const LocalizedDate = ({
    date,
    showTime = false,
}: {
    date: Date;
    showTime?: boolean;
}) => {
    date = new Date(date);
    const localizedDate = date.toLocaleDateString();
    const localizedTime = date.toLocaleTimeString();
    return (
        <span style={{ fontWeight: 700 }}>
            {localizedDate}
            {showTime && ` - ${localizedTime}`}
        </span>
    );
};

export default LocalizedDate;
