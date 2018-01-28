import {singleton} from "../MetaInjector";
import {command} from "../Console/index";
import {SessionStorageInterface} from "../Fusion/ServiceContracts";


@singleton(SessionStorageInterface)
@command('session:clear', 'Flushes all the session of the server')
export default class SessionClearCommand {

    constructor(sessionStorage) {
        this.sessionStorage = sessionStorage;
    }

    async action() {
        await this.sessionStorage.flush();
    }
}
