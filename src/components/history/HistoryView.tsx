import React from "react";
import BaseList from "../List/BaseList";
import HistoryApi from "../../api/history";
import HistoryListItem from "./HistoryListItem";

const HistoryView = ({ targetId, targetModel }) => {
    return (
        <BaseList
            apiCall={HistoryApi.getByTargetId}
            filter={{ targetId, targetModel }}
            renderItem={(history) =>
                history && (
                    <HistoryListItem history={history} />
                )
            }
        />
    );
};
export default HistoryView;
