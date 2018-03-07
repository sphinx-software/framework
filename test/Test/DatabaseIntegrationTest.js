import FusionTestSuite from "./FusionTestSuite";
import * as DatabasePackage from "../../src/Fusion/Database/index";
import * as MetaInjectorPackage from "../../src/Fusion/MetaInjector/index";

import {DatabaseManagerInterface} from "../../src/Fusion/index";

export default class DatabaseIntegrationTest extends FusionTestSuite {

    manifest() {
        return { ...DatabasePackage, ...MetaInjectorPackage}
    }

    async fusionActivated(context) {
        await super.fusionActivated(context);
        try {
            this.dbm = await this.container.make(DatabaseManagerInterface);
            await this.dbm.connection().knexConnection.raw('select 1 + 1 as result');
        } catch (e) {
            context.skip();
        }
    }

    config() {
        return {
            "database": {
                "default": process.env.FUSION_IN_DOCKER ? "mysqlDocker" : "mysql",

                "connections": {
                    "mysql": {
                        "client": "mysql",
                        "connection": {
                            "host"     : 'localhost',
                            "user"     : 'fusion',
                            "password" : 'fusion',
                            "database" : 'fusion'
                        }
                    },
                    "mysqlDocker": {
                        "client": "mysql",
                        "connection": {
                            "host"     : 'mysql',
                            "user"     : 'fusion',
                            "password" : 'fusion',
                            "database" : 'fusion'
                        }
                    }
                }
            }
        }
    }
}