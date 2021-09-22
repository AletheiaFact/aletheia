import React from "react";
import { Input } from "antd";

const InputSearch = (props) => {
    let timeout: NodeJS.Timeout;
    let loading = false;

    const doSearch = (e) => {
        const searchText = e.target.value;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            loading = true;
            props.callback(searchText);
            loading = false;
        }, 300);
    }

    return (
        <Input.Search
            placeholder={props.placeholder || ""}
            size="large"
            loading={loading}
            addonAfter={false}
            addonBefore={false}
            onChange={e => doSearch(e)}
        />
    );
}



export default InputSearch;
