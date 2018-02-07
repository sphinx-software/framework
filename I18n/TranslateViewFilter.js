export class TranslateViewFilter {

    constructor(translator) {
        this.translator = translator;
    }

    run(key) {
        return this.translator.translate(key);
    }
}