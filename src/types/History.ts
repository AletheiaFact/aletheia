import { TargetModel } from "./enums";
import { M2M, User } from "./User";

export const HEX24 = /^[0-9a-fA-F]{24}$/;

export type PerformedBy = M2M | User;

export interface HistoryListItemProps {
  history: {
    user: PerformedBy;
    type: string;
    targetModel: TargetModel;
    date?: Date;
    details: {
      before?: Record<string, any>;
      after: Record<string, any>;
    };
  };
}