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
        // Suppress hydration warning because currentTime varies between server and client rendering
        <span suppressHydrationWarning style={{ fontWeight: 700 }}>
            {localizedDate}
            {showTime && ` - ${localizedTime}`}
        </span>
    );
};

export default LocalizedDate;
