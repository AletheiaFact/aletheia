import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Form, Row } from "antd";
import InputSearch from "../Form/InputSearch";
import api from "../../api/personality";
import { connect } from "react-redux";
import PersonalityCard from "./PersonalityCard";

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

    async createPersonality(personality) {
        const _id = await api.createPersonality(personality, this.props.t);
        // Redirect to personality list in case _id is not present
        const path = _id ? `./${_id}` : "";
        this.props.history.push(path);
    }

    render() {
        const { t } = this.props;
        const { personalities } = this.props;
        return (
            <Row style={{ marginTop: "10px" }}>
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
                                key={i}
                            />
                        )
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
