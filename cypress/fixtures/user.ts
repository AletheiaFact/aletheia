const user = {
    email: "test-cypress@aletheiafact.org",
    password: Cypress.env("CI_ORY_USER_PASSWORD"),
};

export default user;
