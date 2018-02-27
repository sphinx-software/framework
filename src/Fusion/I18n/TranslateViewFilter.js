export class TranslateViewFilter {

    constructor(translator) {
        this.translator = translator;
    }

    run(key, ...parameter) {
        return this.translator.translate(key, ...parameter);
    }
}