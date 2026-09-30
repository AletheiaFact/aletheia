import { z } from "zod";

export const queryInt = z.coerce.number().int();

// Zero-based, matching the legacy DTOs.
export const pageQuery = queryInt.min(0);

export const pageSizeQuery = (max = 100) => queryInt.min(1).max(max);

// Accepts real booleans: the global ValidationPipe pre-converts params typed `boolean`.
export const queryBoolean = z.union([z.boolean(), z.stringbool()]);

// Parity with the legacy class-transformer flag idiom. Only for ported DTOs.
const LEGACY_TRUE_VALUES: unknown[] = [true, "enabled", "true", 1, "1"];
export const legacyQueryFlag = z
    .union([z.boolean(), z.string(), z.number()])
    .optional()
    .transform((value) => LEGACY_TRUE_VALUES.includes(value));

export const queryArray = <T extends z.ZodType>(item: T) =>
    z
        .union([item, z.array(item)])
        .transform((value) => (Array.isArray(value) ? value : [value]));

export const sortOrder = z.enum(["asc", "desc"]);
