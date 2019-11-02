import React from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import ClaimView from './ClaimView'
import ClaimCreate from './ClaimCreate'

const Claim = ({match}) => {
    console.log("Claim", match.params.id);
    return ( 
        <BrowserRouter>
            <Switch>
                <Route exact path={`${match.url}/:claimId`} component={ClaimView} />
                <Route path={`${match.url}/create/:personalityId`} component={ClaimCreate} />
            </Switch>
        </BrowserRouter>
    );
}

export default Claim;