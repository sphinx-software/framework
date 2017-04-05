class AclListCommand {

    constructor(acl) {
        this.acl = acl;
    }

    register(program) {
        return program.command('acl:list');
    }

    async action() {
        console.log('touch');
    }

}

module.exports = AclListCommand;
