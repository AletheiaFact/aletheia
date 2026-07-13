// src/lib/getMessages.ts

import fs from "fs";
import path from "path";

export async function getMessages(locale: string) {
    const localePath = path.join(process.cwd(), "public", "locales", locale);

    const files = fs.readdirSync(localePath);

    const messages = {};

    for (const file of files) {
        if (!file.endsWith(".json")) continue;

        const namespace = file.replace(".json", "");

        const content = JSON.parse(
            fs.readFileSync(path.join(localePath, file), "utf-8")
        );

        messages[namespace] = content;
    }

    return messages;
}
