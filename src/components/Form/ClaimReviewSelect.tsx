import { Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import ClassificationText from "../ClassificationText";
import ClassificationModal from "./ClassificationModal";
import { VisualEditorContext } from "../Collaborative/VisualEditorProvider";

const { Option } = Select;

export const SelectInput = styled(Select)`
    background: ${colors.white};
    box-shadow: 0px 2px 2px ${colors.shadow};
    border-radius: 4px;
    border: none;
    height: 40px;
    width: 100%;

    .ant-select-selector {
        background: none !important;
        border: none !important;
        top: 6px;
        .ant-select-selection-item {
            color: ${colors.blackSecondary};
        }
    }

    .ant-select-selection-placeholder {
        color: ${colors.blackSecondary};
    }

    ::placeholder {
        color: ${colors.blackSecondary};
    }

    :focus {
        border: none;
        box-shadow: 0px 2px 2px ${colors.shadow};
    }

    :active {
        border: none;
    }

    :hover {
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
    const [value, setValue] = useState(defaultValue);
    const { editorConfiguration } = useContext(VisualEditorContext);

    const onChangeSelect = (e) => {
        setValue(e);
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
                <Option value="" disabled>
                    {placeholder}
                </Option>
                <Option value="not-fact">
                    <ClassificationText classification="not-fact" />
                </Option>
                <Option value="trustworthy">
                    <ClassificationText classification="trustworthy" />
                </Option>
                <Option value="trustworthy-but">
                    <ClassificationText classification="trustworthy-but" />
                </Option>
                <Option value="arguable">
                    <ClassificationText classification="arguable" />
                </Option>
                <Option value="misleading">
                    <ClassificationText classification="misleading" />
                </Option>
                <Option value="false">
                    <ClassificationText classification="false" />
                </Option>
                <Option value="unsustainable">
                    <ClassificationText classification="unsustainable" />
                </Option>
                <Option value="exaggerated">
                    <ClassificationText classification="exaggerated" />
                </Option>
                <Option value="unverifiable">
                    <ClassificationText classification="unverifiable" />
                </Option>
            </SelectInput>
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
