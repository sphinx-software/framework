class SessionClearCommand {

    constructor(sessionStorage) {
        this.sessionStorage = sessionStorage;
    }

    get name() {
        return 'session:clear';
    }

    async action() {
        await this.sessionStorage.flush();
    }
}

module.exports = SessionClearCommand;
