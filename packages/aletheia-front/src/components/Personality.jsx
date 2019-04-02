import React, { Component } from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import PersonalityView from './PersonalityView'
import PersonalityList from './PersonalityList'

const Personality = ({match}) => {
    return ( 
        <BrowserRouter>
            <Switch>
                <Route exact path={`${match.url}`} component={PersonalityList} />
                <Route path={`${match.url}/:id`} component={PersonalityView} />
            </Switch>
        </BrowserRouter>
    );
}

export default Personality;