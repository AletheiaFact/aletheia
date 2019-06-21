/* eslint-disable no-undef */
/* eslint-disable strict */

const PersonalityController = require('../../../api/controller/personalityController');
const PersonalityRepository = require('../../../api/repository/personality');

describe('Personality Controller', () => {
    let personality = null;
    beforeEach(() => {
        personality = new PersonalityController();
    });

    test('Get All', () => {
        const mockListAll = jest.spyOn(PersonalityRepository, 'listAll');
        mockListAll.mockImplementation(() => {
            return {};
        });

        personality.listAll()
            .then(
                expect(personality).toMatchObject({})
            );

        mockListAll.mockRestore();
    });

    test('Get By Id', () => {

    });

    test('Create', () => {

    });

    test('Update', () => {

    });

    test('Delete', () => {

    });

    afterEach(() => {
        personality = null;
    });
});
