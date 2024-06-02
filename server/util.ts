import { Injectable } from "@nestjs/common";
import { Roles } from "./auth/ability/ability.factory";
import { randomBytes } from "crypto";
import { NameSpaceEnum } from "./auth/name-space/schemas/name-space.schema";

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

    getParamsBasedOnUserRole(params, req) {
        const user = req.user;
        const namespace = req.params.namespace || NameSpaceEnum.Main;
        const isUserAdmin =
            user?.role[namespace] === Roles.Admin ||
            user?.role[namespace] === Roles.SuperAdmin;
        return isUserAdmin ? params : { ...params, isHidden: false };
    }

    canEditUser(user, request): boolean {
        const editorId = request.user._id;
        const namespace = request.params.namespace || NameSpaceEnum.Main;
        const isSelectedSuperAdmin = user.role[namespace] === Roles.SuperAdmin;
        const editingSelf = user._id === editorId;

        return (isSelectedSuperAdmin && editingSelf) || !isSelectedSuperAdmin;
    }

    getVisibilityMatch = () => ({
        $match: {
            $or: [
                {
                    $and: [
                        { "claimContent.isHidden": { $ne: true } },
                        { "claimContent.isDeleted": { $ne: true } },
                        { "personality.isHidden": { $ne: true } },
                        { "personality.isDeleted": { $ne: true } },
                    ],
                },
            ],
        },
    });
}
