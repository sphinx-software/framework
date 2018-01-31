import {provider} from "../Fusion/Fusion";
import {Config, DatabaseManagerInterface} from "../Fusion/ServiceContracts";
import DatabaseManager from "./DatabaseManager";
import knex from "knex";
import lodash from "lodash";
import KnexExtensor from "./KnexExtensor";

@provider()
export default class DatabaseServiceProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.value(DatabaseManagerInterface, new DatabaseManager());
        this.container.value(KnexExtensor, new KnexExtensor());
    }

    async boot() {

        let manager  = await this.container.make(DatabaseManagerInterface);
        let config   = await this.container.make(Config);
        let extensor = await this.container.make(KnexExtensor);

        lodash.forIn(config.database.connections, (connectionConfig, name) => {
            connectionConfig.postProcessResponse = result => extensor.handlePostProcess(result);
            manager.extend(name, () => extensor.upgrade(knex(connectionConfig)));
        });

        manager.setDefaultAdapter(config.database.default);
    }
}