import {provider} from "../Fusion/Fusion";
import {Config, TranslatorInterface} from "../Fusion/ServiceContracts";
import Translator from "./Translator";
import Backend from 'i18next-node-fs-backend';
import i18next from 'i18next';


@provider()
export default class I18nProvider {

    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    register() {
        this.container.singleton(TranslatorInterface, async () => {
            let config = await this.container.make(Config);
            i18next.use(Backend).init(config.i18n);
            return new Translator(i18next);
        })

    }
}
