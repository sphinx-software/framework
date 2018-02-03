import {provider} from "../Fusion/Fusion";
import {Config, DatabaseManagerInterface} from "../Fusion/ServiceContracts";
import DatabaseManager from "./DatabaseManager";
import knex from "knex";
import lodash from "lodash";
import KnexConnectionWrapper from "./KnexConnectionWrapper";

@provider()
export default class DatabaseServiceProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.value(DatabaseManagerInterface, new DatabaseManager());
    }

    async boot() {

        let manager  = await this.container.make(DatabaseManagerInterface);
        let config   = await this.container.make(Config);

        lodash.forIn(config.database.connections, (connectionConfig, name) => {
            manager.extend(name, () => new KnexConnectionWrapper(knex(connectionConfig)));
        });

        manager.setDefaultAdapter(config.database.default);
    }
}
