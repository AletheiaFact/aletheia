import React, { Component } from "react";
import api from "../../api/personality";
import { Row } from "antd";
import "./PersonalityList.css";
import PersonalityCard from "./PersonalityCard";
import PersonalityCreateCTA from "./PersonalityCreateCTA";
import BaseList from "../List/BaseList";

class PersonalityList extends Component {
    render() {
        const createPersonalityCTA = (
            <Row
                style={{
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%"
                }}
            >
                <PersonalityCreateCTA href="personality/search" />
            </Row>
        );
        return (
            <BaseList
                apiCall={api.getPersonalities}
                emptyFallback={createPersonalityCTA}
                renderItem={p =>
                    p && (
                        <PersonalityCard
                            personality={p}
                            summarized={true}
                            key={p._id}
                        />
                    )
                }
                footer={createPersonalityCTA}
            />
        );
    }
}
export default PersonalityList;
