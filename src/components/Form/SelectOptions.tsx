import { Select } from "antd";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import Loading from "../Loading";
import { Roles } from "../../types/enums";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const StyledSelect = styled(Select)`
    .ant-select-selector {
        border-radius: 4px;
    }

    .ant-select-selection-placeholder {
        color: ${colors.graySecondary};
    }
`;

function SelectOptions({
    fieldName = "",
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
        return !props?.preloadedTopics?.includes(slug || value);
    });
    const [nameSpace] = useAtom(currentNameSpace);

    const { t } = useTranslation();

    const getOptions = useMemo(() => {
        return (value: string) => {
            setOptions([]);
            setFetching(true);
            //TODO: query with the filter
            fetchOptions(value, t, nameSpace).then((newOptions) => {
                if (fieldName === "crossCheckerId") {
                    const reviewerUsers = newOptions.filter(
                        (user) => user?.role[nameSpace] !== Roles.Regular
                    );
                    setOptions(reviewerUsers);
                } else if (fieldName === "reviewerId") {
                    const reviewerUsers = newOptions.filter(
                        (user) =>
                            user?.role[nameSpace] === Roles.Reviewer ||
                            user?.role[nameSpace] === Roles.Admin ||
                            user?.role[nameSpace] === Roles.SuperAdmin
                    );
                    setOptions(reviewerUsers);
                } else {
                    setOptions(newOptions);
                }
                setFetching(false);
            });
        };
    }, [fetchOptions, fieldName, nameSpace, t]);

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
