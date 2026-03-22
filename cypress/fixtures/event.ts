import { getFutureDay, today } from "../utils/dateUtils";

export const routes = {
    listPage: "/event",
    createPage: "/event/create",
};

export const topic = {
    name: "Conferência das Nações Unidas sobre as Mudanças Climáticas de 2025",
    value: "Q115323194",
    aliases: ["COP30"],
    matchedAlias: "COP30",
};

export const cop28Topic = {
    name: "Conferência das Nações Unidas sobre as Mudanças Climáticas de 2023",
    aliases: ["COP28"],
    value: "Q123456",
};

export const buildEvent = (overrides = {}) => ({
    badge: "COP30",
    name: topic.name,
    description: "E2E test event description",
    location: "Belém, Brasil",
    startDate: today.toISOString(),
    endDate: getFutureDay(2).toISOString(),
    mainTopic: topic,
    filterTopics: [],
    ...overrides,
});
