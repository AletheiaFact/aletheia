// The server calls Wikidata and Commons through the mock server started in
// cypress/plugins/wikimediaMock.ts. Start every spec file from the default
// items, whatever the previous spec changed.
before(() => {
    cy.task("wikimediaMockReset");
});
