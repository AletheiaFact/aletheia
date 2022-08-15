import { Select, Spin } from "antd";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import colors from "../../../styles/colors";

const StyledSelect = styled(Select)`
    .ant-select-selector {
        border-radius: 4px;
    }

    .ant-select-selection-placeholder {
        color: ${colors.graySecondary};
    }
`;

function SelectOptions({ fetchOptions, mode, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const getOptions = useMemo(() => {
        return (value: string) => {
            setOptions([]);
            setFetching(true);
            fetchOptions(value).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };
    }, [fetchOptions]);

    return (
        <StyledSelect
            mode={mode}
            showSearch
            filterOption={false}
            onSearch={getOptions}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            options={options}
            {...props}
        />
    );
}

export default SelectOptions;
