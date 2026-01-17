import React, { useMemo } from "react";
import { useTranslation } from "next-i18next";
import LocalizedDate from "../LocalizedDate";

const getDisplayName = (user: any, t: any): string => {
  // to do type and refactor function
  if (typeof user === "string") {
    return "Chatbot";
  } else if (user?.isM2M === true) {
    return "M2M";
  } else if (user?._id) {
    return user.name;
  } else {
    return t("anonymousUserName");
  }
};

const HistoryListItem: React.FC<{ history: any }> = ({ history }) => {
  const { t } = useTranslation("history");

  const vm = useMemo(() => {
    try {
      const { user, type, targetModel, details, date } = history;

      const username = getDisplayName(user, t);

      const titleField = targetModel === "personality" ? "name" : "title";
      const displayTitle =
        type === "delete"
          ? details?.before?.[titleField]
          : details?.after?.[titleField];

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
