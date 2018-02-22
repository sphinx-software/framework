import Manager from '../Manager';

/**
 * @implements DiskManagerInterface
 */
export default class DiskManager extends Manager {

    /**
     *
     * @param {String} name
     * @return {DiskInterface}
     */
    disk(name = null) {
        return this.adapter(name);
    }

    setConfigDisks(disks) {
        this.disks = disks;
    }

    registerForType(type, callback) {
        Object.keys(this.disks)
            .filter(name => this.disks[name].adapter === type)
            .forEach(name => this.extend(name, () => callback(this.disks[name])))
    }

}
