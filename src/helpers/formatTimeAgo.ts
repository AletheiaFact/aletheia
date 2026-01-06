import { useTranslation } from "next-i18next";

export function formatTimeAgo(date: Date | string) {//need to create unit tests for this method
  const { t } = useTranslation("timeAgo");
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return t("minutesAgo", { count: minutes });

  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return t("hoursAgo", { count: hours });

  const days = Math.floor(diff / 86400000);
  if (days < 7) return t("daysAgo", { count: days });

  return new Date(date).toLocaleDateString("pt-BR");
}
