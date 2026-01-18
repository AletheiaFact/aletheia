import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import LocalizedDate from "../LocalizedDate";
import { User } from "../../types/User";
import { TFunction } from "i18next";
import { M2M } from "../../../server/entities/m2m.entity";

type PerformedBy = M2M | User | string;

interface HistoryListItemProps {
  history: {
    user: PerformedBy;
    type: string;
    targetModel: string;
    date?: Date;
    details: {
      before?: Record<string, any>;
      after: Record<string, any>;
    };
  };
}

const getDisplayName = (user: PerformedBy, t: TFunction): string => {
  if (typeof user === "string") {
    return t("virtualAssistant");
  }
  if (user && "isM2M" in user) {
    return t("automatedMonitoring");
  }
  if (user && "name" in user) {
    return user.name;
  }
  return t("anonymousUserName");
};

const HistoryListItem: React.FC<HistoryListItemProps> = ({ history }) => {
  const { t } = useTranslation("history");

  const vm = useMemo(() => {
    try {
      const { user, type, targetModel, details, date } = history;

      const username = getDisplayName(user, t);

      const titleField = targetModel === "personality" ? "name" : "title";
      const data = type === "delete" ? details?.before : details?.after;
      const displayTitle = data?.[titleField];

      return { username, type, targetModel, displayTitle, date };
    } catch (err) {
      console.error("Mapping error:", err);
      return null;
    }
  }, [history, t]);

  if (!vm) return null;

  return (
    <div style={{ fontSize: 14, padding: "4px 0" }}>
      <LocalizedDate date={vm.date} showTime />
      {` - `}
      <strong>{vm.username}</strong> {t(vm.type)} {t(vm.targetModel)}{" "}
      {vm.displayTitle && `"${vm.displayTitle}"`}
    </div>
  );
};

export default HistoryListItem;
