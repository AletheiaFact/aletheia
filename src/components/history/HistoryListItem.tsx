import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import LocalizedDate from "../LocalizedDate";
import { TFunction } from "i18next";
import { HistoryListItemProps, PerformedBy } from "../../types/history";
import { isM2M, isUser } from "../../utils/typeGuards";
import { M2MSubject } from "../../types/enums";

const getDisplayName = (user: PerformedBy, t: TFunction): string => {
  if (isM2M(user) && user.subject === M2MSubject.Chatbot) {
    return t("virtualAssistant");
  }
  if (isM2M(user)) {
    return t("automatedMonitoring");
  }
  if (isUser(user)) {
    return user.name;
  }
  return t("anonymousUserName");
};

const HistoryListItem: React.FC<HistoryListItemProps> = ({ history }) => {
  const { t } = useTranslation("history");

  const currentHistory = useMemo(() => {
    try {
      const { user, type, targetModel, details, date } = history;

      const username = getDisplayName(user, t);

      const titleField = targetModel === "Personality" ? "name" : "title";
      const data = type === "delete" ? details?.before : details?.after;
      const displayTitle = data?.[titleField];

      return { username, type, targetModel, displayTitle, date };
    } catch (err) {
      console.error("Mapping error:", err);
      return null;
    }
  }, [history, t]);

  if (!currentHistory) return null;

  return (
    <div style={{ fontSize: 14, padding: "4px 0" }}>
      <LocalizedDate date={currentHistory.date} showTime />
      {` - `}
      <strong>{currentHistory.username}</strong> {t(currentHistory.type)} {t(currentHistory.targetModel)}{" "}
      {currentHistory.displayTitle && `"${currentHistory.displayTitle}"`}
    </div>
  );
};

export default HistoryListItem;
