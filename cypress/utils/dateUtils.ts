import dayjs from "dayjs";

export const today = dayjs();

export const getPastDay = (daysAgo: number) =>
    dayjs().subtract(daysAgo, "day");
