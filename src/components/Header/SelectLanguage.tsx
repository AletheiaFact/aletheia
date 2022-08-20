import { Select } from "antd";
import { BR, GB } from "country-flag-icons/react/3x2";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";

const { Option } = Select;

const SelectLanguage = (props: { defaultLanguage; dataCy }) => {
    const [language, setLanguage] = useState(props.defaultLanguage);

    useEffect(() => {
        const cookieLanguage =
            Cookies.get("default_language") || props.defaultLanguage;
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
                paddingTop: 15,
                display: "flex",
                width: 50,
            }}
            bordered={false}
            showArrow={false}
            value={language}
            onSelect={setDefaultLanguage}
            data-cy={props.dataCy}
        >
            <Option default value="pt" data-cy="testLanguagePt">
                <BR style={{ width: "25px" }} />
            </Option>
            <Option value="en" data-cy="testLanguageEn">
                <GB title="EN" style={{ width: "25px" }} />
            </Option>
        </Select>
    );
};

export default SelectLanguage;
