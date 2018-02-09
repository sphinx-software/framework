import lodash from 'lodash';
export default class MassageBag {

    constructor(data){
        this.data = data ? data : {};
    }

    /**
     *
     * @param data
     */
    setData(data) {
        this.data = data;
    }

    /**
     *
     * @param key
     * @param valueDefault
     */
    get(key, valueDefault = null) {
        return lodash.get(this.data, key, valueDefault);
    }

    /**
     *
     * @param key
     */
    has(key) {
        return lodash.has(this.data, key);
    }
}