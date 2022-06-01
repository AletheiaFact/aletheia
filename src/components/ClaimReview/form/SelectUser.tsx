import { Select, Spin } from 'antd';
import React, { useMemo, useState } from 'react';


function SelectUser({ fetchOptions, ...props }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const getOptions = useMemo(() => {
        return (value: string) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value).then(newOptions => {
                setOptions(newOptions);
                setFetching(false);
            });
        };
    }, [fetchOptions]);

    return (
        <Select
            filterOption={false}
            onSearch={getOptions}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            options={options}
        />
    );
}

export default SelectUser;
