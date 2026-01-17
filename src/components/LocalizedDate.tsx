import { useTranslation } from "next-i18next";
import React from "react";

interface LocalizedDateProps {
  date: Date | string | number;
  showTime?: boolean;
}

const LocalizedDate = ({ date, showTime = false }: LocalizedDateProps) => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language || "en";
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return null;

  const formattedDate = dateObj.toLocaleDateString(currentLocale);
  const formattedTime = showTime ? ` - ${dateObj.toLocaleTimeString(currentLocale)}` : "";

  return (
    <time dateTime={dateObj.toISOString()} style={{ fontWeight: 700 }}>
      {formattedDate}{formattedTime}
    </time>
  );
};

export default LocalizedDate;
