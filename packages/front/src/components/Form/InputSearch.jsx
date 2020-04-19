import React, { Component } from "react";
import { Input } from "antd";

const { Search } = Input;

class InputSearch extends Component {
    constructor(props) {
        super(props);
        this.timeout = 0;
        this.loading = false;
    }

    doSearch(e) {
        const searchText = e.target.value;
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.loading = true;
            this.props.callback(searchText);
            this.loading = false;
        }, 300);
    }

    render() {
        return (
            <Search
                placeholder="Type a name..."
                size="large"
                loading={this.loading}
                onChange={e => this.doSearch(e)}
            />
        );
    }
}

export default InputSearch;
