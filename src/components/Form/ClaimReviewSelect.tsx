import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import ClassificationText from "../ClassificationText";
import ClassificationModal from "./ClassificationModal";
import { VisualEditorContext } from "../Collaborative/VisualEditorProvider";
import { MenuItem, Select, FormControl } from "@mui/material";

export const SelectInput = styled(Select)`
    background: ${colors.white};
    box-shadow: 0px 2px 2px ${colors.shadow};
    border-radius: 4px;
    border: none;
    height: 40px;
    width: 100%;
    padding: 10px;

    .MuiSelect-select {
    background: none !important;
    color: ${colors.blackSecondary};
    padding: 0 !important;
  }

    .MuiOutlinedInput-notchedOutline {
    border: none !important;
  }

    ::placeholder {
        color: ${colors.blackSecondary};
    }

     :focus .MuiOutlinedInput-notchedOutline {
        border: none;
        box-shadow: 0px 2px 2px ${colors.shadow};
    }

    :active {
        border: none;
    }

    :hover .MuiOutlinedInput-notchedOutline {
        border: none;
    }
`;

const ClaimReviewSelect = ({
    type,
    onChange,
    defaultValue,
    placeholder,
    style = {},
}) => {
    const { vw } = useAppSelector((state) => state);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(defaultValue || "");
    const { editorConfiguration } = useContext(VisualEditorContext);

    const onChangeSelect = (e) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        onChange(value);
    }, [value, onChange]);

    const handleCloseModal = () => {
        setOpen(false);
    };

    const handleOnClick = () => {
        if (vw?.sm) {
            setOpen(true);
        }
    };

    const handleChangeOk = () => {
        setOpen(false);
    };

    return (
        <>
            <FormControl fullWidth>
                <SelectInput
                    type={type}
                    onChange={onChangeSelect}
                    onClick={handleOnClick}
                    value={value}
                    disabled={editorConfiguration?.readonly}
                    data-cy={"testClassificationText"}
                    dropdownStyle={vw?.sm && { display: "none" }}
                    style={style}
                >
                    <MenuItem value="" disabled>
                        {placeholder}
                    </MenuItem>
                    <MenuItem value="not-fact">
                        <ClassificationText classification="not-fact" />
                    </MenuItem>
                    <MenuItem value="trustworthy">
                        <ClassificationText classification="trustworthy" />
                    </MenuItem>
                    <MenuItem value="trustworthy-but">
                        <ClassificationText classification="trustworthy-but" />
                    </MenuItem>
                    <MenuItem value="arguable">
                        <ClassificationText classification="arguable" />
                    </MenuItem>
                    <MenuItem value="misleading">
                        <ClassificationText classification="misleading" />
                    </MenuItem>
                    <MenuItem value="false">
                        <ClassificationText classification="false" />
                    </MenuItem>
                    <MenuItem value="unsustainable">
                        <ClassificationText classification="unsustainable" />
                    </MenuItem>
                    <MenuItem value="exaggerated">
                        <ClassificationText classification="exaggerated" />
                    </MenuItem>
                    <MenuItem value="unverifiable">
                        <ClassificationText classification="unverifiable" />
                    </MenuItem>
                </SelectInput>
            </FormControl>
            <ClassificationModal
                open={open}
                value={value}
                setValue={setValue}
                handleOk={handleChangeOk}
                handleCancel={handleCloseModal}
            />
        </>
    );
};

export default ClaimReviewSelect;
