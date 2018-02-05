/**
 * @implements DatabaseConnectionInterface
 */
export default class KnexConnectionWrapper {

    constructor(knexConnection) {
        this.knexConnection = knexConnection;
    }

    query() {
        return this.knexConnection.queryBuilder();
    }

    execute(query) {
    }

    transaction(procedure) {
    }

    schema() {
    }
}