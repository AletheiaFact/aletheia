// Test data setup utilities

export const createTestPersonality = () => {
    return cy.request({
        method: 'POST',
        url: '/api/personality',
        body: {
            name: "Oprah Winfrey",
            slug: "oprah-winfrey",
            description: "Test personality for Cypress tests",
            wikidata: "Q55800",
            twitter: "@oprah"
        },
        failOnStatusCode: false
    }).then((response) => {
        if (response.status === 201) {
            cy.log('Test personality created successfully');
            return response.body;
        } else if (response.status === 409) {
            cy.log('Test personality already exists');
            // Fetch existing personality
            return cy.request('GET', '/api/personality/oprah-winfrey').then(res => res.body);
        } else {
            cy.log(`Personality creation failed with status: ${response.status}`);
            return null;
        }
    });
};

export const createTestClaim = (personalityId: string) => {
    return cy.request({
        method: 'POST',
        url: '/api/claim',
        body: {
            title: "Speech Claim Title",
            slug: "speech-claim-title",
            content: "Speech Claim Content Lorem Ipsum Dolor Sit Amet...",
            source: "https://wikimedia.org",
            personalities: [personalityId],
            contentModel: "speech",
            date: new Date().toISOString()
        },
        failOnStatusCode: false
    }).then((response) => {
        if (response.status === 201) {
            cy.log('Test claim created successfully');
            return response.body;
        } else if (response.status === 409) {
            cy.log('Test claim already exists');
            // Fetch existing claim
            return cy.request('GET', `/api/claim/speech-claim-title`).then(res => res.body);
        } else {
            cy.log(`Claim creation failed with status: ${response.status}`);
            return null;
        }
    });
};

export const setupTestData = () => {
    cy.log('Setting up test data...');
    
    return createTestPersonality().then((personality) => {
        if (personality && personality._id) {
            return createTestClaim(personality._id).then((claim) => {
                cy.log('Test data setup completed');
                return { personality, claim };
            });
        } else {
            throw new Error('Failed to create test personality');
        }
    });
};