let jobStatus = require('./../job-status');

class DatabaseQueue {
    constructor(serializer, database) {
        this.serialzier = serializer;
        this.database   = database;
    }

    setQueueTable(table) {
        this.table = table;
        return this;
    }

    async next() {
        let rawNextJob = null;
        this.database.transaction(async (trx) => {
            rawNextJob = await trx.select().from(this.table).where({status: jobStatus.IDLE}).orderBy('enqueued_at').limit(1);

            if (!rawNextJob.length) {
                return null;
            }

            await trx.from(this.table).update({status: jobStatus.WORKING}).where({id: rawNextJob[0].id});
        });

        return await this.serialzier.deserialize(rawNextJob.data);
    }

    async enqueue(job, data) {

    }
}