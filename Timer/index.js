import {singleton} from "../MetaInjector";

const VError = require('verror');

@singleton()
export default class Timer {

    /**
     *
     *
     * @param milisec
     * @return {Promise}
     */
    wait(milisec) {
        return new Promise(res => setTimeout(res, milisec));
    }

    /**
     *
     * @param longtimeJob
     * @param milisec
     * @param timeoutError
     * @return {Promise.<{}>}
     */
    async timeout(longtimeJob, milisec, timeoutError = null) {
        let waitPromise = this.wait(milisec)
            .then(() => {
                throw (timeoutError || new VError('E_TIMER: Timeout reached [%s]ms', milisec))
            })
        ;

        return await Promise.race([waitPromise, longtimeJob]);
    }
}