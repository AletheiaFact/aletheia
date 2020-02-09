const PersonalityRepository = require("../repository/personality");

module.exports = class PersonalityController {
    async listAll(query) {
        const { page = 0, pageSize = 10, order = "desc" } = query;
        const queryInputs = await this.verifyInputsQuery(query);

        return Promise.all([
            PersonalityRepository.listAll(
                page,
                parseInt(pageSize, 10),
                order,
                queryInputs
            ),
            PersonalityRepository.count(queryInputs)
        ])
            .then(([personalities, totalPersonalities]) => {
                return {
                    personalities,
                    totalPersonalities,
                    totalPages: Math.ceil(
                        totalPersonalities / parseInt(pageSize, 10)
                    ),
                    page,
                    pageSize
                };
            })
            .catch(error => error);
    }

    verifyInputsQuery(query) {
        const queryInputs = {};
        if (query.name) {
            queryInputs.name = { $regex: query.name, $options: "i" };
        }
        return queryInputs;
    }

    create(body) {
        try {
            return PersonalityRepository.create(body);
        } catch (error) {
            return error;
        }
    }

    getPersonalityId(id) {
        try {
            return PersonalityRepository.getById(id);
        } catch (error) {
            return error;
        }
    }

    getReviewStats(id) {
        try {
            return PersonalityRepository.getReviewStats(id);
        } catch (error) {
            return error;
        }
    }

    async update(id, body) {
        try {
            return PersonalityRepository.update(id, body);
        } catch (error) {
            return error;
        }
    }

    async delete(id) {
        try {
            await PersonalityRepository.delete(id);
            return { message: "Personality successfully deleted" };
        } catch (error) {
            return error;
        }
    }
};
