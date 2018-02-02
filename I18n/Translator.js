
export default class Translator {

    constructor(i18next) {
        this.i18next = i18next;
    }


    /**
     * set locale
     * @param locale
     */
    locale(locale) {
        this.i18next.changeLanguage(locale);
    }

    /**
     *
     * @param key
     */
    translate(key) {
        return this.i18next.t(key);
    }
}
