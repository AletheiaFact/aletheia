import { Col } from "antd";
import { useState } from "react";
import api from "../../api/topicsApi";
import AletheiaButton from "../Button";
import UserAutocomplete from "./UserAutocomplete";

const TopicInput = ({}) => {
    const [topics, setTopics] = useState<any>([]);

    console.log(topics);
    return (
        <Col>
            <UserAutocomplete
                placeholder="Topics"
                dataCy="Teste"
                onChange={(value) => setTopics(value)}
                fieldName="topicsInput"
            />
            <AletheiaButton onClick={() => api.createTopics(topics)}>
                Button
            </AletheiaButton>
        </Col>
    );
};

export default TopicInput;
