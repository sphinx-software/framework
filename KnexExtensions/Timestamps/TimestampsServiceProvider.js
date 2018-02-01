import {provider} from "../../Fusion/Fusion";
import KnexExtensor from "../../Database/KnexExtensor";
import {DatabaseManagerInterface} from "../../Fusion/ServiceContracts";
import lodash from 'lodash';

@provider()
export default class TimestampsServiceProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {

    }

    async boot() {
        let extensor = await this.container.make(KnexExtensor);


        //Persistence

        // Soft delete records
        extensor.registerScoper('remove', function (queryBuilder) {
            queryBuilder.update('deleted_at', new Date().getTime());
        });

        // Restore soft deleted records
        extensor.registerScoper('restore', function (queryBuilder) {
            queryBuilder.update('deleted_at', null);
        });

        // Update the records with new updated_at timestamp
        extensor.registerScoper('touch', function (queryBuilder) {
            queryBuilder.update('updated_at', new Date().getTime());
        });

        extensor.registerScoper('create', function (queryBuilder, data) {
            if (lodash.isArray(data)) {

            }
        });

        // Query

        // Find records that soft deleted
        extensor.registerScoper('inTrash', function (queryBuilder) {
            queryBuilder.whereNotNull('deleted_at');
        });

        // Find records that has not been soft deleted
        extensor.registerScoper('find', function (queryBuilder) {
            queryBuilder.whereNull('deleted_at');
        });

        //
        extensor.registerScoper('oldest', function (queryBuilder) {
            queryBuilder.orderBy('created_at');
        });

        //
        extensor.registerScoper('newest', function (queryBuilder) {
            queryBuilder.orderBy('created_at', 'desc');
        });

        extensor.registerScoper('earliest', function (queryBuilder) {
            queryBuilder.orderBy('updated_at');
        });

        //
        extensor.registerScoper('latest', function (queryBuilder) {
            queryBuilder.orderBy('updated_at', 'desc');
        });

        // let dbm = await this.container.make(DatabaseManagerInterface);

        // console.log(dbm.from('credentials')._method);

        // console.log(dbm.from('credentials').where('name', 'like', '%rikky').restore().toSQL());
    }

}
