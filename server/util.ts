import { Injectable } from "@nestjs/common";
import { Roles } from "./auth/ability/ability.factory";
import { NameSpaceEnum } from "./auth/name-space/schemas/name-space.schema";

@Injectable()
export class UtilService {
    formatStats(reviews: { _id: string[]; count: number }[]) {
        const total = reviews.reduce(
            (agg: number, review: { count: number }) => {
                agg += review.count;
                return agg;
            },
            0
        );
        const result = reviews.map(
            (review: { _id: string[]; count: number }) => {
                const percentage = (review.count / total) * 100;
                return {
                    _id: review._id[0],
                    percentage: percentage.toFixed(0),
                    count: review.count,
                };
            }
        );
        return { total, reviews: result };
    }

    /**
     * https://medium.com/javascript-in-plain-english/javascript-merge-duplicate-objects-in-array-of-objects-9a76c3a1c35c
     * @param array
     * @param property
     */
    mergeObjectsInUnique<T>(array: T[], property: keyof T): T[] {
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

    getParamsBasedOnUserRole(params: Record<string, any>, req: any) {
        const user = req.user;
        const namespace = req.params.namespace || NameSpaceEnum.Main;
        const isUserAdmin =
            user?.role[namespace] === Roles.Admin ||
            user?.role[namespace] === Roles.SuperAdmin;
        return isUserAdmin ? params : { ...params, isHidden: false };
    }

    canEditUser(user: any, request: any): boolean {
        const editorId = request.user._id;
        const namespace = request.params.namespace || NameSpaceEnum.Main;
        const isSelectedSuperAdmin = user.role[namespace] === Roles.SuperAdmin;
        const editingSelf = user._id === editorId;

        return (isSelectedSuperAdmin && editingSelf) || !isSelectedSuperAdmin;
    }

    getVisibilityMatch = (nameSpace: string) => ({
        $match: {
            $or: [
                {
                    $and: [
                        { "claimContent.isHidden": { $ne: true } },
                        { "claimContent.isDeleted": { $ne: true } },
                        { "claimContent.nameSpace": nameSpace },
                        { "personality.isHidden": { $ne: true } },
                        { "personality.isDeleted": { $ne: true } },
                    ],
                },
            ],
        },
    });
}
