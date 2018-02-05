export default class Timestamp {

    /**
     *
     * @param {Date} createdAt
     * @param {Date} updatedAt
     * @param {Date} deletedAt
     */
    constructor(createdAt = null, updatedAt = null, deletedAt = null) {
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    getDeletedAt() {
        return this.deletedAt;
    }

    getUpdatedAt() {
        return this.updatedAt;
    }

    toJson() {
        return {
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
            deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null
        }
    }
}
