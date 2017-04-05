class SessionClearCommand {

    constructor(sessionStorage) {
        this.sessionStorage = sessionStorage;
    }

    register(program) {
        return program.command('session:clear');
    }

    async action() {
        await this.sessionStorage.flush();
    }
}

module.exports = SessionClearCommand;
