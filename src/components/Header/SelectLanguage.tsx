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
.MuiSwitch-track {
    background-color: ${({ namespace }) =>
        namespace === NameSpaceEnum.Main
            ? colors.primary
            : colors.secondary};
}

.MuiSwitch-thumb {
   display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${colors.white};
    border-radius: 50%;
    width: 24px;
    height: 24px;
    }
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
                >
                    <MenuItem value="pt" data-cy="testLanguagePt">
                        <ReactCountryFlag
                            countryCode="BR"
                            style={{ fontSize: "20px", paddingTop: "6px" }}
                        />
                    </MenuItem>
                    <MenuItem value="en" data-cy="testLanguageEn">
                        <ReactCountryFlag
                            countryCode="GB"
                            style={{ fontSize: "20px", paddingTop: "6px" }}
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
                                style={{ fontSize: "14px", paddingTop: "4px" }}
                            />
                        }
                        checkedIcon={
                            <ReactCountryFlag
                                countryCode="BR"
                                style={{ fontSize: "14px", paddingTop: "4px" }}
                            />
                        }
                    />
                </div>
            )}
        </>
    );
};

export default SelectLanguage;
