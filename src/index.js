import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import "./i18n";

import App from "./App";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginView from "./components/Login/LoginView";
import { Layout } from "antd";

ReactDOM.render(
    <Provider store={store}>
        <Layout style={{ minHeight: "100vh" }}>
            <Router>
                <Switch>
                    <Route component={App} />
                </Switch>
            </Router>
        </Layout>
    </Provider>,
    document.getElementById("root")
);
