export const URL_PATTERN =
/^(?!.*\.$)(https?|ftp):\/\/[^\s/$.?#]+(\.[A-Za-z]{2,})+([/?#][^\s]*)?$/i;

export const validateFloatingLink = (href?: string, t?: (key: string) => string) => {
  if (href?.endsWith('.')) {
    throw new Error(t("sourceForm:errorMessageTrailingDot"));
  }

  if (!URL_PATTERN.test(href)) {
    throw new Error(t("sourceForm:errorMessageValidURL"));
  }
};
