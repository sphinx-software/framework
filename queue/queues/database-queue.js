const JobStatus = require('./../job-status');

class DatabaseQueue {

    /**
     *
     * @param {knex} database
     * @param {Serializer} serializer
     */
    constructor(database, serializer) {
        this.database    = database;
        this.serializer  = serializer;
        this.fetchedJobs = [];
    }

    /**
     *
     * @param {string} table
     * @return {DatabaseQueue}
     */
    setQeueTable(table) {
        this.table = table;

        return this;
    }

    /**
     *
     * @param {integer} numberOfJobs
     * @return {DatabaseQueue}
     */
    threshold(numberOfJobs) {
        this.numberOfJobs = numberOfJobs;

        return this;
    }

    /**
     * Fetches the queue from the storage layer
     *
     * @return {Promise.<void>}
     */
    async fetch() {
        let rawJobs = [];
        await this.database.transaction(async (trx) => {
            rawJobs = await trx
                .from(this.table)
                .where({status: JobStatus.IDLE})
                .limit(this.numberOfJobs)
                .orderBy('enqueued_at')
            ;

            await trx.from(this.table)
                .whereIn('id', rawJobs.map(job => job.id))
                .update({status: JobStatus.WORKING})
            ;
        });

        this.fetchedJobs = rawJobs.map( rawJob => {
            return {
                job: this.serializer.deserialize(rawJob.job),
                arguments: this.serializer
            }
        });
    }

    /**
     * Pushes a job into the end of queue
     *
     * @param job
     * @param arguments
     * @return {Promise.<void>}
     */
    async push(job, ...arguments) {

    }

    /**
     * Gets the next job, also remove it from the queue.
     * If the queue is empty, then it will return null
     *
     */
    next() {

    }

    /**
     * Gets the queue size
     *
     * @return int
     */
    size() {

    }

    /**
     *
     */
    empty() {

    }
}

module.exports = DatabaseQueue;
