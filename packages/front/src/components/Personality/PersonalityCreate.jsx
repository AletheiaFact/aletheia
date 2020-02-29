import React, { Component } from "react";
import { FormGroup, Input, Label } from "reactstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import axios from "axios";

import { Box, Grid, TextArea, Form, Button } from "grommet";
import * as Icons from "grommet-icons";
class PersonalityCreate extends Component {
    constructor(props) {
        super(props);

        this.savePersonality = this.savePersonality.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
    }
    state = {
        allowNew: false,
        isLoading: false,
        multiple: false,
        options: [],
        personality: {},
        inputsDisabled: false
    };

    wikidataSearch(query, lang = "en") {
        const params = {
            action: "wbsearchentities",
            search: query,
            format: "json",
            errorformat: "plaintext",
            language: lang,
            uselang: lang,
            type: "item",
            origin: "*"
        };

        axios
            .get(`https://www.wikidata.org/w/api.php`, { params })
            .then(response => {
                const { data } = response;
                console.log(data);
                this.setState({
                    isLoading: false,
                    options: data.search
                });
            })
            .catch(e => {
                throw e;
            });
    }

    _handleSearch = query => {
        this.setState({ isLoading: true });
        this.wikidataSearch(query);
    };

    onNameChange(selected) {
        if (Array.isArray(selected) && selected.length > 0) {
            selected = selected[0];
            axios
                .get(`${process.env.API_URL}/wikidata/${selected.id}`)
                .then(response => {
                    const personality = {
                        ...response.data,
                        wikidata: selected.id
                    };
                    console.log(personality.image);
                    this.setState({
                        personality,
                        inputsDisabled: true
                    });
                })
                .catch(() => {
                    console.log(
                        "Error while fetching Wikdiata metadata of Personality "
                    );
                });
        } else {
            this.setState({
                personality: {
                    bio: ""
                },
                inputsDisabled: false
            });
        }
    }

    savePersonality(e) {
        e.preventDefault();
        // TODO: Check if personality already exists
        axios
            .post(`${process.env.API_URL}/personality`, this.state.personality)
            .then(response => {
                console.log(response.data);
            })
            .catch(() => {
                console.log("Error while saving claim");
            });
    }
    render() {
        const { personality } = this.state;
        const imageStyle = {
            backgroundImage: `url(${personality.image})`
        };
        return (
            <Grid
                rows={["full"]}
                columns={["full"]}
                areas={[{ name: "header", start: [0, 0], end: [0, 0] }]}
            >
                <Box gridArea="header" direction="row" flex pad="small">
                    <Box direction="row" basis="full" gap="large">
                        {personality.image ? (
                            <div className="thumbnail">
                                <div className="thumbnail__container">
                                    <div
                                        className="thumbnail__img"
                                        style={imageStyle || ""}
                                    ></div>
                                </div>
                            </div>
                        ) : (
                            <Box
                                as="h2"
                                sm={{ size: 6, offset: 2 }}
                                style={{ width: "200px" }}
                            >
                                <Icons.User color="plain" size="xlarge" />
                            </Box>
                        )}
                        <Box basis="full">
                            <Form onSubmit={this.savePersonality}>
                                <FormGroup>
                                    <AsyncTypeahead
                                        {...this.state}
                                        filterBy={["label"]}
                                        labelKey="label"
                                        minLength={3}
                                        id="typeahead"
                                        onSearch={this._handleSearch}
                                        onChange={this.onNameChange}
                                        placeholder="Name of the personality"
                                        renderMenuItemChildren={(
                                            option,
                                            props
                                        ) => {
                                            return (
                                                <div>
                                                    <span key={option.id}>
                                                        {option.label}
                                                    </span>
                                                    <small>
                                                        {option.description}
                                                    </small>
                                                </div>
                                            );
                                        }}
                                    />
                                    <TextArea
                                        placeholder="Bio"
                                        name="bio"
                                        defaultValue={
                                            this.state.personality.bio || ""
                                        }
                                        id="bio"
                                        disabled={this.state.inputsDisabled}
                                    />
                                </FormGroup>
                                <Button
                                    icon={<Icons.FormAdd />}
                                    label="Save Personality"
                                    primary
                                    type="submit"
                                ></Button>
                            </Form>
                        </Box>
                    </Box>
                </Box>
            </Grid>
        );
    }
}

export default PersonalityCreate;
