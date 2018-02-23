import knex                                 from "knex";
import { provider }                         from "../Fusion";
import { Config, DatabaseManagerInterface } from "../ServiceContracts";
import DatabaseManager                      from "./DatabaseManager";
import KnexConnectionWrapper                from "./KnexConnectionWrapper";

@provider()
export default class DatabaseServiceProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion = fusion;
    }

    register() {
        this.container.singleton(DatabaseManagerInterface, () => new DatabaseManager())
            .made(DatabaseManagerInterface, async manager => {
                let config = await this.container.make(Config);

                manager.setDefaultAdapter(config.database.default)
                    .setConfigAdapters(config.database.connections)
                    .setPropertyDriver('client')
                    .extend(['mysql', 'sqlite3', 'pg', 'mssql', 'oracle'], (config) => new KnexConnectionWrapper(knex(config)))
            })
        ;
    }

}
