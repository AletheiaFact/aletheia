import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import App from './App'
import Speech from './components/Speech'
import Personality from './components/Personality'

import 'bootstrap/dist/css/bootstrap.css'
import "semantic-ui-css/semantic.min.css";


const AppRouter = (
    <BrowserRouter>
        <Switch>
            <Route path="/speech" component={Speech} />
            <Route path="/personality" component={Personality} />
            <Route path="/" exact={true} component={App} />
        </Switch>
    </BrowserRouter>
);

ReactDOM.render(AppRouter, document.getElementById('root'))
