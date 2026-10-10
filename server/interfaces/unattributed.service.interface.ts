import type { IUnattributed } from "./claim-content.interface";

export type IUnattributedService = {
    create(unattributedBody: Record<string, any>): Promise<IUnattributed>;
};
