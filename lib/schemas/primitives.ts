import { z } from "zod";

export const objectId = z
    .string()
    .regex(/^[a-f\d]{24}$/i, { error: "Invalid ObjectId" });

export const dataHash = z
    .string()
    .regex(/^[a-f0-9]{32}$/i, { error: "Invalid data_hash" });

export const wikidataId = z
    .string()
    .regex(/^Q\d+$/, { error: "Invalid Wikidata id" });

export const nonEmptyText = (max: number) => z.string().trim().min(1).max(max);

export const email = z.string().trim().toLowerCase().pipe(z.email());

export const captchaToken = z.string().min(1);

export const isoDateTime = z.iso.datetime({ offset: true });
