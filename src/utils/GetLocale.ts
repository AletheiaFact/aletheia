const parser = require("accept-language-parser");

export const GetLocale = (req, locale, locales) => {
    return req.cookies.default_language || parser.pick(locales, req.language) || locale || "pt";
}