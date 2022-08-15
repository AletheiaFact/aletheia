import { Col } from "antd";
import { useState } from "react";
import api from "../../api/topicsApi";
import AletheiaButton from "../Button";
import AutoComplete from "./Autocomplete";
import { useTranslation } from "next-i18next";

const TopicInput = ({ sentence_hash }) => {
    const { t } = useTranslation();
    const [topics, setTopics] = useState<any>([]);

    const fetchTopicList = async (topic) => {
        const topicSearchResults = await api.getTopics(topic, t);
        return topicSearchResults.map((topic) => ({
            label: topic.name,
            value: topic._id,
        }));
    };

    return (
        <Col>
            <AutoComplete
                placeholder={t("topics:placeholder")}
                dataCy="testSearchTopics"
                onChange={(value) => setTopics(value)}
                mode="tags"
                dataLoader={fetchTopicList}
            />
            <AletheiaButton
                onClick={() => api.createTopics({ topics, sentence_hash }, t)}
            >
                {t("topics:editTopicsButton")}
            </AletheiaButton>
        </Col>
    );
};

export default TopicInput;
