import fs                from 'fs';
import { promisify }     from 'util';
import path              from 'path';
import { DiskInterface } from '../../ServiceContracts';

export default class LocalDisk extends DiskInterface {

    constructor() {
        super();
        this.fsExists = promisify(fs.exists);
        this.fsDelete = promisify(fs.unlink);
    }

    /**
     *
     * @param directory
     * @return {LocalDisk}
     */
    setDirectory(directory) {
        if (!directory) throw new Error('E_DIRK_LOCAL: config dir is not null');
        this.mkdir(directory);
        this.directory = directory;
        return this;
    }

    /**
     *
     * @param {string} fileName
     * @return {WriteStream}
     */
    createWriteStream(fileName) {
        let dir = path.join(this.directory, path.dirname(fileName));
        if (dir !== this.directory) {
            this.mkdir(dir);
        }
        return fs.createWriteStream(path.join(dir, path.basename(fileName)));
    }

    /**
     *
     * @param {string} directory
     * @return void;
     */
    mkdir(directory) {
        const sep     = path.sep;
        const initDir = path.isAbsolute(directory) ? sep : '';

        directory.split(sep).reduce((parentDir, childDir) => {
            const curDir = path.resolve(__dirname, parentDir, childDir);
            try {
                fs.mkdirSync(curDir);
            } catch (error) {}
            return curDir;
        }, initDir);
    }

    /**
     *
     * @param {string} fileName
     * @return {ReadableStream}
     */
    createReadStream(fileName) {
        return fs.createReadStream(path.join(this.directory, fileName));
    }

    /**
     *
     * @param {string} fileName
     * @return {Promise<void>}
     */
    exists(fileName) {
        return this.fsExists(path.join(this.directory, fileName));
    }

    /**
     *
     * @param {string} fileName
     * @return {Promise<void>}
     */
    delete(fileName) {
        return this.fsDelete(path.join(this.directory, fileName));
    }
}
