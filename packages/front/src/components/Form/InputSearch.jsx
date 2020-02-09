import React, { Component } from "react";

import { Box, TextInput } from "grommet";

import * as Icon from "grommet-icons";

class InputSearch extends Component {
    constructor(props) {
        super(props);
        this.timeout = 0;
    }

    doSearch(e) {
        const searchText = e.target.value;
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.props.callback(searchText);
        }, 300);
    }

    render() {
        return (
            <Box
                direction="row"
                align="center"
                pad={{ horizontal: "small", vertical: "xsmall" }}
                round="small"
                border={{
                    side: "all",
                    color: "border"
                }}
            >
                <Icon.Search color="brand" />
                <TextInput
                    type="search"
                    ref="searchInput"
                    plain
                    placeholder="Type a name..."
                    onChange={e => this.doSearch(e)}
                />
            </Box>
        );
    }
}

export default InputSearch;
