import axios from "axios";
import { TFunction } from "i18next";
import { MessageManager } from "../components/Messages";
import { HEX24 } from "../types/History";
import { EventPayload, ListEventsOptions } from "../types/event";
import { NextRouter } from "next/router";
import { NameSpaceEnum } from "../types/Namespace";

const request = axios.create({
    withCredentials: true,
    baseURL: `/api/event`,
});

const createEvent = (
    newEvent: EventPayload,
    router: NextRouter,
    t?: TFunction
) => {
    const { nameSpace = NameSpaceEnum.Main } = newEvent;

    return request
        .post("/", newEvent)
        .then((response) => {
            MessageManager.showMessage(
                "success",
                t("events:eventCreateSuccess")
            );

            router.push(
                nameSpace === NameSpaceEnum.Main
                    ? "/event"
                    : `/${nameSpace}/event`
            );

            return response.data
        })
        .catch((err) => {
            MessageManager.showMessage(
                "error",
                t("events:createError")
            );
            throw err;
        });
};

const updateEvent = (eventId: string, updatedEvent: Partial<EventPayload>, t?: TFunction) => {
    if (!HEX24.test(eventId)) {
        MessageManager.showMessage(
            "error",
            t("events:errorInvalidId")
        );
        return Promise.reject(new Error("Invalid ID"));
    }

    return request
        .patch(`/${eventId}`, updatedEvent)
        .then((response) => response.data)
        .catch((err) => {
            MessageManager.showMessage(
                "error",
                t("events:updateError")
            );
            throw err;
        });
};

const getEvents = (options: ListEventsOptions = {}, t?: TFunction) => {
    const params = {
        page: options.page ? options.page - 1 : 0,
        pageSize: options.pageSize ?? 10,
        order: options.order ?? "asc",
        status: options.status,
    };

    return request
        .get("/", { params })
        .then((response) => {
            return {
                events: response.data.events,
                total: response.data.total
            };
        })
        .catch((err) => {
            MessageManager.showMessage(
                "error",
                t("events:fetchError")
            );
            throw err;
        });
};

const EventApi = {
    createEvent,
    updateEvent,
    getEvents,
};

export default EventApi;
