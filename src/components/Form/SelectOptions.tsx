import { Select } from "antd";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import Loading from "../Loading";

const StyledSelect = styled(Select)`
    .ant-select-selector {
        border-radius: 4px;
    }

    .ant-select-selection-placeholder {
        color: ${colors.graySecondary};
    }
`;

function SelectOptions({
    fetchOptions,
    mode,
    style,
    value,
    preloadedOptions = [],
    preloadedTopics = [],
    loading = false,
    ...props
}) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState(preloadedOptions);

    const filteredOptions = options.filter(({ value }) => {
        const slug = value.toLowerCase().replace(" ", "-");
        return !props?.preloadedTopics.includes(slug || value);
    });

    const { t } = useTranslation();

    const getOptions = useMemo(() => {
        return (value: string) => {
            setOptions([]);
            setFetching(true);
            fetchOptions(value, t).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };
    }, [fetchOptions, t]);

    return (
        <StyledSelect
            mode={mode}
            showSearch
            filterOption={false}
            onSearch={getOptions}
            notFoundContent={fetching ? <Loading /> : null}
            options={filteredOptions}
            tokenSeparators={[","]}
            style={{ ...style }}
            value={value}
            {...props}
        />
    );
}

export default SelectOptions;
