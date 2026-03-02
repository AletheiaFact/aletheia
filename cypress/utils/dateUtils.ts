import dayjs from "dayjs";

export const today = dayjs();

export const getPastDay = (daysAgo: number) =>
    dayjs().subtract(daysAgo, "day");

export const getFutureDay = (daysAhead: number) =>
    dayjs().add(daysAhead, "day");
