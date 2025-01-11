import { Select, Switch } from "antd";
import ReactCountryFlag from "react-country-flag";
import Cookies from "js-cookie";
import React, { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import { useAppSelector } from "../../store/store";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const { Option } = Select;

const SelectInput = styled(Select)`
    .ant-select-selection-item {
        display: flex;
        align-items: center;
    }

    .ant-select-arrow {
        color: ${colors.white};
        font-size: 0.8rem;
    }
`;

const SwitchInputStyle = styled(Switch)`
    background-color: ${({ namespace }) =>
        namespace === NameSpaceEnum.Main ? colors.primary : colors.secondary};
`;

const SelectLanguage = (props: { defaultLanguage; dataCy }) => {
    const { vw } = useAppSelector((state) => state);
    const [switchLoading, setSwitchLoading] = useState<boolean>(false);
    const [nameSpace] = useAtom(currentNameSpace);
    const language = Cookies.get("default_language") || props.defaultLanguage;
    const [nameSpaceProp, setNameSpaceProp] = useState(NameSpaceEnum.Main);

    useLayoutEffect(() => {
        setNameSpaceProp(nameSpace);
    }, [nameSpace]);

    const setDefaultLanguage = (language) => {
        if (!document.cookie.includes(`default_language=${language}`)) {
            window.location.reload();
        }
        document.cookie = `default_language=${language}`;
    };

    const onChangeSwitch = (checked: boolean) => {
        const language = checked ? "pt" : "en";
        setSwitchLoading((state) => !state);
        setDefaultLanguage(language);
    };

    return (
        <>
            {!vw?.xs && (
                <SelectInput
                    bordered={false}
                    showArrow={true}
                    value={language}
                    onSelect={setDefaultLanguage}
                    data-cy={props.dataCy}
                >
                    <Option value="pt" data-cy="testLanguagePt">
                        <ReactCountryFlag
                            countryCode="BR"
                            style={{ fontSize: "20px", paddingTop: "6px" }}
                        />
                    </Option>
                    <Option value="en" data-cy="testLanguageEn">
                        <ReactCountryFlag
                            countryCode="GB"
                            style={{ fontSize: "20px", paddingTop: "6px" }}
                        />
                    </Option>
                </SelectInput>
            )}
            {vw?.xs && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 4,
                        alignItems: "center",
                    }}
                >
                    <span style={{ fontSize: 10 }}>
                        {language === "pt" ? "BR" : "EN"}
                    </span>
                    <SwitchInputStyle
                        checkedChildren={<ReactCountryFlag countryCode="BR" />}
                        unCheckedChildren={
                            <ReactCountryFlag countryCode="GB" />
                        }
                        defaultChecked={language === "pt"}
                        onChange={onChangeSwitch}
                        loading={switchLoading}
                        namespace={nameSpaceProp}
                    />
                </div>
            )}
        </>
    );
};

export default SelectLanguage;
