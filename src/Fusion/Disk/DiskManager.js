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

}
