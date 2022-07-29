import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { GB, BR } from "country-flag-icons/react/3x2";
import colors from "../../styles/colors";
import Cookies from "js-cookie";

const { Option } = Select;

const SelectLanguage = (props: { defaultLanguage; dataCy }) => {
    const [language, setLanguage] = useState(props.defaultLanguage);

    useEffect(() => {
        const cookieLanguage = Cookies.get("default_language");
        setLanguage(cookieLanguage);
    }, []);

    const setDefaultLanguage = (language) => {
        if (!document.cookie.includes(`default_language=${language}`)) {
            window.location.reload();
        }
        document.cookie = `default_language=${language}`;
    };

    return (
        <Select
            style={{
                padding: 0,
                border: "2px",
                borderColor: colors.grayPrimary,
                borderRadius: "4px",
                background: "none",
            }}
            value={language}
            onSelect={setDefaultLanguage}
            data-cy={props.dataCy}
        >
            <Option default value="pt">
                <BR style={{ width: "22px" }} />
            </Option>
            <Option value="en">
                <GB title="EN" style={{ width: "22px" }} />
            </Option>
        </Select>
    );
};

export default SelectLanguage;
