import React, { Component } from "react";
import WikidataTypeAhead from "./WikidataTypeAhead";
import { withTranslation } from "react-i18next";
import { Button, Col, Form, message, Pagination, Row } from "antd";
import InputSearch from "../Form/InputSearch";
import api from "../../api/personality";
import { connect } from "react-redux";
import PersonalityCard from "./PersonalityCard";
import axios from "axios";
import PersonalityCreateCTA from "./PersonalityCreateCTA";

class PersonalityCreateSearch extends Component {
    constructor(props) {
        super(props);
    }
    handleInputSearch(name) {
        console.log(name);
        this.props.dispatch({
            type: "SET_SEARCH_NAME",
            searchName: name
        });

        api.getPersonalities(this.props, this.props.dispatch);
    }

    createPersonality(personality) {
        axios
            .post(`${process.env.API_URL}/personality`, personality)
            .then(response => {
                const { name, _id } = response.data;
                console.log(response);
                message.success(
                    `"${name}" ${this.props.t(
                        "personalityCreateForm:successMessage"
                    )}`
                );

                // Redirect to personality list in case _id is not present
                const path = _id ? `./${_id}` : "";
                this.props.history.push(path);
            })
            .catch(err => {
                console.log(err);
                const response = err && err.response;
                if (!response) {
                    // TODO: Track unknow errors
                    console.log(err);
                }
                const { data } = response;
                message.error(
                    data && data.message
                        ? data.message
                        : this.props.t("personalityCreateForm:errorMessage")
                );
            });
    }

    render() {
        const { t } = this.props;
        const { personalities } = this.props;
        return (
            <Row style={{ padding: "10px 30px", marginTop: "10px" }}>
                <Form
                    style={{
                        width: "100%"
                    }}
                >
                    <Form.Item
                        label={t("personalityCreateForm:name")}
                        style={{
                            width: "100%"
                        }}
                    >
                        <InputSearch
                            placeholder={t("header:search_personality")}
                            callback={this.handleInputSearch.bind(this)}
                        />
                    </Form.Item>
                    <Form.Item>
                        {/* <Button type="primary" htmlType="submit">*/}
                        {/*    {t("personalityCreateForm:Next")}*/}
                        {/* </Button>*/}
                    </Form.Item>
                </Form>
                {personalities.map(
                    (p, i) =>
                        p && (
                            <PersonalityCard
                                personality={p}
                                summarized={true}
                                suggestion
                                hrefBase="./"
                                onClick={this.createPersonality.bind(this)}
                                key={p._id}
                            />
                        )
                )}
                {this.props.searchName &&
                    this.props.searchName.length > 0 &&
                    Array.isArray(this.props.personalities) &&
                    !this.props.personalities.length && (
                        <Row
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                                width: "100%"
                            }}
                        >
                            <PersonalityCreateCTA href="./create" />
                        </Row>
                    )}
            </Row>
        );
    }
}

const mapStateToProps = state => {
    return {
        personalities: state?.search?.searchResults || [],
        searchName: state?.search?.searchInput || null
    };
};
export default connect(mapStateToProps)(
    withTranslation()(PersonalityCreateSearch)
);
