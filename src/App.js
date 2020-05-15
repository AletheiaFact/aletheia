import React, { Component } from "react";
import { Layout } from "antd";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.less";

import ClaimCreate from "./components/Claim/ClaimCreate";
import ClaimView from "./components/Claim/ClaimView";
import PersonalityList from "./components/Personality/PersonalityList";
import PersonalityView from "./components/Personality/PersonalityView";
import PersonalityCreate from "./components/Personality/PersonalityCreate";
const { Header, Footer, Sider, Content } = Layout;

class App extends Component {
    render() {
        return (
            <Layout>
                <Header>
                    <div className="logo">
                        <a href="/">Aletheia</a>
                    </div>
                </Header>
                <Content style={{ padding: "10px" }}>
                    <Router>
                        <Switch>
                            <Route exact path="/" component={PersonalityList} />
                            <Route
                                exact
                                path="/personality"
                                component={PersonalityList}
                            />
                            <Route
                                exact
                                path="/personality/create"
                                component={PersonalityCreate}
                            />
                            <Route
                                exact
                                path="/personality/:id"
                                component={PersonalityView}
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
                        </Switch>
                    </Router>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    Aletheia ©2020 Created by Open Tesseract
                </Footer>
            </Layout>
        );
    }
}

export default App;
