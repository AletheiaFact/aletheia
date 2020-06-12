import React, { Component } from "react";
import axios from "axios";
import { Select } from "antd";
import { withTranslation } from "react-i18next";

const { Option } = Select;
class WikdiataTypeAhead extends Component {
    constructor(props) {
        super(props);

        this.state = {
            children: [],
            search: []
        };
        this.onSelect = this.onSelect.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    wikidataSearch(query, lang = "en") {
        const params = {
            action: "wbsearchentities",
            search: query,
            format: "json",
            errorformat: "plaintext",
            language: lang,
            type: "item",
            origin: "*"
        };

        axios
            .get(`https://www.wikidata.org/w/api.php`, { params })
            .then(response => {
                const { search } = response && response.data;
                const children =
                    search &&
                    search.map(option => (
                        <Option key={option.id}>
                            <span>{option.label}</span>&nbsp;
                            <small>{option.description}</small>
                        </Option>
                    ));

                this.setState({
                    isLoading: false,
                    children,
                    search
                });
            })
            .catch(e => {
                throw e;
            });
    }

    handleSearch(query) {
        this.setState({ query, isLoading: true });
        this.wikidataSearch(query, this.props.i18n.languages[0]);
    }

    fetchWikidata(wikidataId, language = "en") {
        const wbEntities = this.state.search.filter(
            child => child.id === wikidataId
        );

        if (Array.isArray(wbEntities) && wbEntities.length > 0) {
            const wbEntity = wbEntities[0];
            axios
                .get(`${process.env.API_URL}/wikidata/${wbEntity.id}`, {
                    params: { language }
                })
                .then(response => {
                    const personality = {
                        ...response.data,
                        wikidata: wbEntity.id
                    };
                    this.props.callback({
                        personality,
                        inputsDisabled: true
                    });
                })
                .catch(e => {
                    throw e;
                });
        } else {
            this.props.callback({
                personality: {
                    name: this.state.query,
                    description: ""
                },
                inputsDisabled: false
            });
        }
    }

    onSelect(query, option) {
        this.setState({ query }, () => {
            this.fetchWikidata(option.props.key, this.props.i18n.languages[0]);
        });
    }

    onChange(query) {
        this.setState({ query }, () => {
            this.props.callback({
                personality: {
                    name: this.state.query,
                    description: ""
                },
                inputsDisabled: false
            });
        });
    }

    render() {
        return (
            <Select
                showSearch
                autoFocus={true}
                backfill={false}
                filterOption={false}
                style={this.props.style || {}}
                onSearch={this.handleSearch}
                onSelect={this.onSelect}
                onChange={this.onChange}
                placeholder={this.props.placeholder || ""}
            >
                {this.state.children}
            </Select>
        );
    }
}

export default withTranslation()(WikdiataTypeAhead);
