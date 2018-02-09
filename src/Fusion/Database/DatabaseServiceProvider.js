import {provider} from "../Fusion";
import {Config, DatabaseManagerInterface} from "../ServiceContracts";
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
        this.container.singleton(DatabaseManagerInterface, async () => new DatabaseManager())
            .made(DatabaseManagerInterface, async manager => {
                let config   = await this.container.make(Config);

                lodash.forIn(config.database.connections, (connectionConfig, name) => {
                    manager.extend(name, () => new KnexConnectionWrapper(knex(connectionConfig)));
                });

                manager.setDefaultAdapter(config.database.default);
            })
        ;
    }

}
