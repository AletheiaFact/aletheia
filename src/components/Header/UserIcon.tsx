import * as React from "react";

const UserIcon = (props) => {
    const { size } = props;

    return (
        <svg
            width={size}
            height={size}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Zm12 10.063C18.046 15.57 15.186 15 12 15s-6.045.571-8 3.063V20h16v-1.938Z"
                fill="#fff"
            />
        </svg>
    );
};

export default UserIcon;
