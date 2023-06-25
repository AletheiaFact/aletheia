import { Select } from "antd";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../store/store";
import colors from "../../styles/colors";
import ClassificationText from "../ClassificationText";
import ClassificationModal from "./ClassificationModal";

const { Option } = Select;

export const SelectInput = styled(Select)`
    background: ${colors.white};
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
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

    ::placeholder {
        color: ${colors.blackSecondary};
    }

    :focus {
        border: none;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    }

    :active {
        border: none;
    }

    :hover {
        border: none;
    }
`;

const ClaimReviewSelect = ({ type, onChange, defaultValue, placeholder }) => {
    const { vw } = useAppSelector((state) => state);
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState(defaultValue);

    const onChangeSelect = (e) => {
        setValue(e);
    };

    useEffect(() => {
        onChange(value);
    }, [value, onChange]);

    const handleCloseModal = () => {
        setVisible(false);
    };

    const handleOnClick = () => {
        if (vw?.sm) {
            setVisible(true);
        }
    };

    const handleChangeOk = () => {
        setVisible(false);
    };

    return (
        <>
            <SelectInput
                type={type}
                onChange={onChangeSelect}
                onClick={handleOnClick}
                value={value}
                data-cy={"testClassificationText"}
                dropdownStyle={vw?.sm && { display: "none" }}
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
                visible={visible}
                value={value}
                setValue={setValue}
                handleOk={handleChangeOk}
                handleCancel={handleCloseModal}
            />
        </>
    );
};

export default ClaimReviewSelect;
