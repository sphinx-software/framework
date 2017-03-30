class NunjucksEngine {

    constructor(nunjucksEnvironment) {
        this.nunjuckEnvironment = nunjucksEnvironment;
    }

    /**
     *
     * @param {View} view
     * @return {Promise<string>}
     */
    async render(view) {
        let env = this.nunjuckEnvironment;

        return await new Promise((resolve, reject) => {
            env.render(view.getTemplate(), view.getData(), (error, result) => {
                if (error) {
                    return reject(error);
                }

                return resolve(result);
            });
        });
    }
}

module.exports = NunjucksEngine;
