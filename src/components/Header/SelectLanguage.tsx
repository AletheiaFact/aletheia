import { Select } from "antd";
import { BR, GB } from "country-flag-icons/react/3x2";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import colors from "../../styles/colors";

const { Option } = Select;

const SelectInput = styled(Select)`
    background-color: none;
    .ant-select-arrow {
        color: ${colors.white};
        font-size: 0.8rem;
    }
`;

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
        <SelectInput
            style={{
                paddingTop: 6,
            }}
            bordered={false}
            showArrow={true}
            value={language}
            onSelect={setDefaultLanguage}
            data-cy={props.dataCy}
        >
            <Option default value="pt" data-cy="testLanguagePt">
                <BR style={{ width: "20px" }} />
            </Option>
            <Option value="en" data-cy="testLanguageEn">
                <GB title="EN" style={{ width: "20px" }} />
            </Option>
        </SelectInput>
    );
};

export default SelectLanguage;
