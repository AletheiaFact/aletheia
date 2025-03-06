import ReactCountryFlag from "react-country-flag";
import Cookies from "js-cookie";
import React, { useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { Select, MenuItem, Switch } from "@mui/material";
import colors from "../../styles/colors";
import { useAppSelector } from "../../store/store";
import { NameSpaceEnum } from "../../types/Namespace";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";


const SelectInput = styled(Select)`
    .MuiOutlinedInput-notchedOutline {
        border: none;
     }

    .MuiSelect-select {
        display: flex;
        align-items: center;
    }

    .MuiSvgIcon-root {
        color: ${colors.white};
        font-size: 0.8rem;
    }
`;

const StyledSwitch = styled(Switch)`
  .MuiSwitch-switchBase {
    padding: 6px;
  }

  MuiSwitch-thumb {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${colors.white};
    border-radius: 50%;
  }

  .MuiSwitch-track {
    border-radius: 22px;
    background-color: ${({ namespace }) =>
        namespace === NameSpaceEnum.Main ? colors.secondary : colors.primary};
    opacity: 1;
    height: 18px;
  }
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
                    onChange={(e) => setDefaultLanguage(e.target.value as string)}
                    onSelect={setDefaultLanguage}
                    data-cy={props.dataCy}
                    loading={switchLoading}
                >
                    <MenuItem value="pt" data-cy="testLanguagePt">
                        <ReactCountryFlag
                            countryCode="BR"
                            style={{ fontSize: "18px", borderRadius: "50%" }}
                        />
                    </MenuItem>
                    <MenuItem value="en" data-cy="testLanguageEn">
                        <ReactCountryFlag
                            countryCode="GB"
                            style={{ fontSize: "18px", borderRadius: "50%" }}
                        />
                    </MenuItem>
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
                    <StyledSwitch
                        checked={language === "pt"}
                        onChange={(e) => onChangeSwitch(e.target.checked)}
                        namespace={nameSpaceProp}
                        icon={
                            <ReactCountryFlag
                                countryCode="GB"
                                style={{
                                    fontSize: "16px",
                                    paddingTop: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: colors.white,
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                }}
                            />
                        }
                        checkedIcon={
                            <ReactCountryFlag
                                countryCode="BR"
                                style={{
                                    fontSize: "16px",
                                    paddingTop: "6px",
                                    borderRadius: "50%",
                                    backgroundColor: colors.white,
                                    width: "24px",
                                    height: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                }}
                            />
                        }
                    />
                </div>
            )}
        </>
    );
};

export default SelectLanguage;
