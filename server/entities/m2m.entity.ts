import { Roles } from "../auth/ability/ability.factory";
export class M2M {
  isM2M: boolean;
  clientId: string;
  subject: string;
  scopes: string[];
  role: {
    main: Roles.Integration;
  };
  namespace: string;
}
