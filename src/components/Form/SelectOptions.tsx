import { Select } from "antd";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import colors from "../../styles/colors";
import Loading from "../Loading";
import { Roles } from "../../types/enums";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";
import { currentUserRole } from "../../atoms/currentUser";

const StyledSelect = styled(Select)`
    .ant-select-selector {
        border-radius: 4px;
    }

    .ant-select-selection-placeholder {
        color: ${colors.neutralSecondary};
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
    const [role] = useAtom(currentUserRole);
    const [nameSpace] = useAtom(currentNameSpace);

    const { t } = useTranslation();

    const getOptions = useMemo(() => {
        return (value: string) => {
            setOptions([]);
            setFetching(true);
            const canAssignUsers = !(
                fieldName === "usersId" && role === Roles.FactChecker
            );
            const filterOutRoles =
                fieldName === "reviewerId"
                    ? [Roles.Regular, Roles.FactChecker]
                    : [Roles.Regular];

            fetchOptions(
                value,
                t,
                nameSpace,
                filterOutRoles,
                canAssignUsers
            ).then((newOptions) => {
                setOptions(newOptions);
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
