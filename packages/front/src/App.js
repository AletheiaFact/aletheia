import React, { Component } from "react";
import {
    Box,
    Button,
    Collapsible,
    Heading,
    Grommet,
    Layer,
    ResponsiveContext
} from "grommet";
import { FormClose, Notification } from "grommet-icons";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import ClaimCreate from "./components/Claim/ClaimCreate";
import ClaimView from "./components/Claim/ClaimView";
import PersonalityList from "./components/Personality/PersonalityList";
import PersonalityView from "./components/Personality/PersonalityView";

const theme = {
    global: {
        colors: {
            brand: "#228BE6"
        },
        font: {
            family: "Roboto",
            size: "14px",
            height: "20px"
        }
    }
};

const AppBar = props => (
    <Box
        tag="header"
        direction="row"
        align="center"
        justify="between"
        background="brand"
        pad={{ left: "medium", right: "small", vertical: "small" }}
        elevation="medium"
        style={{ zIndex: "1" }}
        {...props}
    />
);

class App extends Component {
    state = {
        showSidebar: false
    };

    render() {
        const { showSidebar } = this.state;
        return (
            <Router>
                <Grommet theme={theme}>
                    <ResponsiveContext.Consumer>
                        {size => (
                            <Box fill>
                                <AppBar>
                                    <Heading level="3" margin="none">
                                        Aletheia
                                    </Heading>
                                    <Button
                                        icon={<Notification />}
                                        onClick={() => {
                                            this.setState(prevState => ({
                                                showSidebar: !prevState.showSidebar
                                            }));
                                        }}
                                    />
                                </AppBar>
                                <Box direction="row" flex pad="small">
                                    <Box flex align="stretch" justify="center">
                                        <Switch>
                                            <Route
                                                exact
                                                path="/personality"
                                                component={PersonalityList}
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
                                    </Box>
                                    {!showSidebar || size !== "small" ? (
                                        <Collapsible
                                            direction="horizontal"
                                            open={showSidebar}
                                        >
                                            <Box
                                                width="medium"
                                                background="light-2"
                                                elevation="small"
                                                align="center"
                                                justify="center"
                                            >
                                                sidebar
                                            </Box>
                                        </Collapsible>
                                    ) : (
                                        <Layer>
                                            <Box
                                                background="light-2"
                                                tag="header"
                                                justify="end"
                                                align="center"
                                                direction="row"
                                            >
                                                <Button
                                                    icon={<FormClose />}
                                                    onClick={() =>
                                                        this.setState({
                                                            showSidebar: false
                                                        })
                                                    }
                                                />
                                            </Box>
                                            <Box
                                                fill
                                                background="light-2"
                                                align="center"
                                                justify="center"
                                            >
                                                sidebar
                                            </Box>
                                        </Layer>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </ResponsiveContext.Consumer>
                </Grommet>
            </Router>
        );
    }
}

export default App;
