import { Select } from "antd";
import React from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import ClassificationText from "../ClassificationText";
const { Option } = Select;

const SelectInput = styled(Select)`
    background: ${colors.white};
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    border-radius: 30px;
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
    return (
        <SelectInput
            type={type}
            onChange={onChange}
            defaultValue={defaultValue}
            data-cy={"testClassificationText"}
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
    );
};

export default ClaimReviewSelect;
