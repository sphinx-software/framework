class SessionClearCommand {

    constructor(sessionStorage) {
        this.sessionStorage = sessionStorage;
    }

    get name() {
        return 'session-clear';
    }

    get description() {
        return 'flushes all the session of the server';
    }

    async action() {
        await this.sessionStorage.flush();
    }
}

module.exports = SessionClearCommand;
