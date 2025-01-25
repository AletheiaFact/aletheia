describe("URL Validation Tests", () => {
    const URL_PATTERN =
    /^(ftp|http|https):\/\/[^ "]+\.[a-zA-Z]{2,}(\/|\?|#|$)/;

  const validUrls = [
      "https://example.com",
      "https://example.br",
      "https://example.org",
      "https://example.net",
      "https://example.edu",
      "https://example.gov",
      "https://example.mil",
      "https://example.co",
      "https://example.info",
      "https://example.io",
      "https://example.biz",
      "https://example.us",
      "https://example.uk",
      "ftp://example.com",
      "http://example.co",
      "https://subdomain.example.org"
  ];

  validUrls.forEach((url) => {
      it(`should accept the URL: ${url}`, () => {
          expect(URL_PATTERN.test(url)).toBe(true);
      });
  });
});
