import { useLocale } from "next-intl";
import React from "react";

interface LocalizedDateProps {
  date: Date | string | number;
  showTime?: boolean;
}

const LocalizedDate = ({ date, showTime = false }: LocalizedDateProps) => {
  const currentLocale = useLocale();
  const dateObj = new Date(date);

  if (Number.isNaN(dateObj.getTime())) return null;

  const formattedDate = dateObj.toLocaleDateString(currentLocale);
  const formattedTime = showTime ? ` - ${dateObj.toLocaleTimeString(currentLocale)}` : "";

  return (
    <time dateTime={dateObj.toISOString()} style={{ fontWeight: 700 }}>
      {formattedDate}{formattedTime}
    </time>
  );
};

export default LocalizedDate;
