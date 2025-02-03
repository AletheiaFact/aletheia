
export const URL_PATTERN =
  /^(ftp|http|https):\/\/[^ "]+\.[a-zA-Z]{2,}(\/|\?|#|$)/;

export const validateFloatingLink = (href?: string, t?: (key: string) => string) => {
  // TODO: use a library or service that maintains a comprehensive list of valid TLDs
  if (!URL_PATTERN.test(href)) {
    throw new Error(t("sourceForm:errorMessageValidURL"));
  }
};