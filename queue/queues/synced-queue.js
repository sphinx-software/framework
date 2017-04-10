class SyncedQueue {

    /**
     *
     * @param logger
     */
    constructor(logger) {
        this.logger = logger;
    }

    /**
     * Pushes a job into the end of queue
     *
     * @param {Job} job
     * @return {Promise.<void>}
     */
    async enqueue(job) {
        let shouldTry = true;
        let tryTimes  = job.attemps || 1;
        let attempt   = 0;

        do {
            try {
                await job.run();
                shouldTry = false;
            } catch (error) {
                this.logger.error(
                    `Failed to run a job. Tried [${attempt}] times. Reason: ${error.getMessage}`, error.stack);
            }

            attempt++;

            if (attempt === tryTimes) {
                shouldTry = false;
            }

        } while (shouldTry);
    }

    /**
     * Gets the next job. If no job is available, then it will return null.
     *
     * @return {Promise.<void>}
     */
    async next() {
        return null;
    }

    /**
     * Determines if the queue is empty.
     *
     * @return {Promise.<number>}
     */
    async empty() {
        return 0;
    }
}

module.exports = SyncedQueue;
