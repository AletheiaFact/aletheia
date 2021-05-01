import React, { Component } from "react";
import claimApi from "../../api/claim";
import BaseList from "../List/BaseList";
import ClaimCard from "./ClaimCard";
import { withRouter } from "react-router-dom";

class ClaimList extends Component {
    constructor(props) {
        super(props);
        this.viewClaim = this.viewClaim.bind(this);
    }
    viewClaim(id, link = false) {
        const path = `./${this.props.match.params.id}/claim/${id}`;
        if (!link) {
            this.props.history.push(path);
        } else {
            return path;
        }
    }

    render() {
        const { personality } = this.props;
        return (
            <BaseList
                apiCall={claimApi.get}
                query={{ personality: personality._id }}
                renderItem={claim =>
                    claim && (
                        <ClaimCard
                            key={claim._id}
                            personality={personality}
                            claim={claim}
                            viewClaim={this.viewClaim}
                        />
                    )
                }
            />
        );
    }
}
export default withRouter(ClaimList);
