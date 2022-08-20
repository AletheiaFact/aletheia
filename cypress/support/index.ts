import './commands'

// eslint-disable-next-line no-undef
Cypress.SelectorPlayground.defaults({
    selectorPriority: ['data-cy', 'data-test', 'data-testid', 'id', 'class', 'attributes'],
})

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false
})
