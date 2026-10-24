import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import ClassificationText from "../ClassificationText";
import ClassificationModal from "./ClassificationModal";
import { VisualEditorContext } from "../Collaborative/VisualEditorProvider";
import { MenuItem, Select, FormControl } from "@mui/material";
import { useClassificationMethodology } from "../../hooks/useClassificationMethodology";
import { getMethodology } from "../../../lib/classification-methodology";

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
    disabled = false,
    ignoreEditorReadonly = false,
    error = false,
}) => {
    const { vw } = useAppSelector((state) => state);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(defaultValue || "");
    const { editorConfiguration } = useContext(VisualEditorContext);
    const methodology = useClassificationMethodology();
    const { options } = getMethodology(methodology);

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
                    displayEmpty
                    type={type}
                    onChange={onChangeSelect}
                    onClick={handleOnClick}
                    value={value}
                    disabled={
                        disabled ||
                        (!ignoreEditorReadonly && editorConfiguration?.readonly)
                    }
                    style={{
                        ...style,
                        ...(error && {
                            border: `1px solid ${colors.error}`,
                            boxShadow: `0px 0px 0px 1px ${colors.error}`,
                        }),
                    }}
                    data-cy={"testClassificationText"}
                    dropdownStyle={vw?.sm && { display: "none" }}
                >
                    <MenuItem value="" disabled>
                        {placeholder}
                    </MenuItem>
                    {options.map(({ value: optionValue }) => (
                        <MenuItem
                            key={optionValue}
                            sx={{ fontFamily: "open-sans, sans-serif" }}
                            value={optionValue}
                        >
                            <ClassificationText
                                classification={optionValue}
                                methodology={methodology}
                            />
                        </MenuItem>
                    ))}
                </SelectInput>
            </FormControl>
            <ClassificationModal
                methodology={methodology}
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
