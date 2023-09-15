import { Injectable, Inject, Scope } from "@nestjs/common";
import { Roles } from "./auth/ability/ability.factory";
import { randomBytes } from "crypto";
import { REQUEST } from "@nestjs/core";
import type { BaseRequest } from "./types";

@Injectable()
export class UtilService {
    formatStats(reviews) {
        const total = reviews.reduce((agg, review) => {
            agg += review.count;
            return agg;
        }, 0);
        const result = reviews.map((review) => {
            const percentage = (review.count / total) * 100;
            return {
                _id: review._id[0],
                percentage: percentage.toFixed(0),
                count: review.count,
            };
        });
        return { total, reviews: result };
    }

    /**
     * https://medium.com/javascript-in-plain-english/javascript-merge-duplicate-objects-in-array-of-objects-9a76c3a1c35c
     * @param array
     * @param property
     */
    mergeObjectsInUnique<T>(array: T[], property: any): T[] {
        const newArray = new Map();

        array.forEach((item: T) => {
            const propertyValue = item[property];
            newArray.has(propertyValue)
                ? newArray.set(propertyValue, {
                      ...item,
                      ...newArray.get(propertyValue),
                  })
                : newArray.set(propertyValue, item);
        });

        return Array.from(newArray.values());
    }

    generatePassword(isTestUser = false, forcePassword = null) {
        const buf = randomBytes(8);

        if (isTestUser) {
            return forcePassword
                ? `${forcePassword}`
                : process.env.DEVELOPMENT_PASSWORD;
        }

        return buf.toString("hex");
    }

    getParamsBasedOnUserRole(params, req) {
        const user = req.user;
        const isUserAdmin = user?.role === Roles.Admin;
        return isUserAdmin ? params : { ...params, isHidden: false };
    }
}
