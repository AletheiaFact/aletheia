import React from "react";
import BaseList from "../List/BaseList";
import HistoryApi from "../../api/historyApi";
import HistoryListItem from "./HistoryListItem";
import HistorySkeleton from "../Skeleton/HistorySkeleton";

const HistoryView = ({ targetId, targetModel }) => {
    return (
        <BaseList
            apiCall={HistoryApi.getByTargetId}
            filter={{ targetId, targetModel }}
            renderItem={(history) =>
                history && <HistoryListItem history={history} />
            }
            skeleton={<HistorySkeleton />}
        />
    );
};
export default HistoryView;
