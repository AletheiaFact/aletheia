import React, { Component } from "react";
import { Layout, Row } from "antd";
import { Route, Switch } from "react-router-dom";
import { withTranslation } from "react-i18next";
import api from "./api/user";
import "./App.less";

import ClaimCreate from "./components/Claim/ClaimCreate";
import ClaimView from "./components/Claim/ClaimView";
import PersonalityList from "./components/Personality/PersonalityList";
import PersonalityView from "./components/Personality/PersonalityView";
import PersonalityCreateForm from "./components/Personality/PersonalityCreateForm";
import AletheiaHeader from "./components/Header/AletheiaHeader";
import Home from "./components/Home/Home";
import BackButton from "./components/BackButton";
import PersonalityCreateSearch from "./components/Personality/PersonalityCreateSearch";
import { connect } from "react-redux";
import SearchOverlay from "./components/SearchOverlay";
import Sidebar from "./components/Sidebar";
import LoginView from "./components/Login/LoginView";

const { Footer, Content, Sider } = Layout;

class App extends Component {
    setLogin(login) {
        return {
            type: "SET_LOGIN_VALIDATION",
            login
        };
    }
    validateSession() {
        return dispatch => {
            return api
                .validateSession({}, this.props.t)
                .then(result => dispatch(this.setLogin(result.login)));
        };
    }

    async componentDidMount() {
        this.props.dispatch(this.validateSession());
    }

    render() {
        const { t, enableOverlay } = this.props;
        return (
            <>
                <Sidebar
                    menuCollapsed={this.props.menuCollapsed}
                    onToggleSidebar={() => {
                        this.props.dispatch({
                            type: "TOGGLE_MENU",
                            menuCollapsed: !this.props.menuCollapsed
                        });
                    }}
                />
                <Layout>
                    <AletheiaHeader />
                    <Content className="main-content">
                        <Row style={{ padding: "0 30px", marginTop: "10px" }}>
                            <BackButton />
                        </Row>
                        <Switch>
                            <Route exact path="/login" component={LoginView} />
                            <Route exact path="/" component={Home} />
                            <Route
                                exact
                                path="/personality"
                                component={PersonalityList}
                            />
                            <Route
                                exact
                                path="/personality/create"
                                component={PersonalityCreateForm}
                            />
                            <Route
                                exact
                                path="/personality/search"
                                render={props => (
                                    <PersonalityCreateSearch
                                        {...props}
                                        withSuggestions={true}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/personality/:id"
                                component={PersonalityView}
                            />
                            <Route
                                exact
                                path="/personality/:id/edit"
                                render={props => (
                                    <PersonalityCreateForm
                                        {...props}
                                        edit={true}
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/personality/:id/claim/create"
                                component={ClaimCreate}
                            />
                            <Route
                                exact
                                path="/personality/:id/claim/:claimId"
                                component={ClaimView}
                            />
                            <Route
                                exact
                                path="/personality/:id/claim/:claimId/edit"
                                render={props => (
                                    <ClaimCreate {...props} edit={true} />
                                )}
                            />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: "center" }}>
                        {t("footer:copyright")}
                    </Footer>
                    {enableOverlay && <SearchOverlay overlay={enableOverlay} />}
                </Layout>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state?.login || false,
        enableOverlay: state?.search?.overlay,
        menuCollapsed:
            state?.menuCollapsed !== undefined ? state?.menuCollapsed : true
    };
};
export default connect(mapStateToProps)(withTranslation()(App));
