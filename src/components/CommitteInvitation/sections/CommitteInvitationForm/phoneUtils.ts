import { AsYouType, CountryCode, isValidPhoneNumber } from "libphonenumber-js";

const COUNTRY_TO_ISO: Record<string, CountryCode> = {
    Brasil: "BR",
    Portugal: "PT",
};

export const getIsoCountry = (country: string): CountryCode | undefined =>
    COUNTRY_TO_ISO[country];

export const getPhonePlaceholder = (country: string): string | undefined => {
    switch (getIsoCountry(country)) {
        case "BR":
            return "(11) 91234-5678";
        case "PT":
            return "912 345 678";
        default:
            return undefined;
    }
};

export const formatPhoneInput = (value: string, country: string): string => {
    const isoCountry = getIsoCountry(country);
    if (!isoCountry) return value;
    return new AsYouType(isoCountry).input(value);
};

export const isPhoneValid = (value: string, country: string): boolean => {
    const isoCountry = getIsoCountry(country);
    if (!isoCountry) return !!value;
    return isValidPhoneNumber(value, isoCountry);
};
