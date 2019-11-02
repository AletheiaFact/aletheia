import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import PersonalityView from './PersonalityView'
import ClaimView from './ClaimView'
import ClaimCreate from './ClaimCreate'
import PersonalityList from './PersonalityList'

const Personality = ({match}) => {
    return ( 
        <BrowserRouter>
            <Switch>
                <Route exact path={`${match.url}`} component={PersonalityList} />
                <Route exact path={`${match.url}/:id`} component={PersonalityView} />
                <Route exact path={`${match.url}/:id/claim/:claimId`} component={ClaimView} />
                <Route exact path={`${match.url}/:id/claim/create`} component={ClaimCreate} />
            </Switch>
        </BrowserRouter>
    );
}

export default Personality;