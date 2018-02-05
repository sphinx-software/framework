import {provider} from "../Fusion/Fusion";
import MetaInjector from "./MetaInjector";

@provider()
export default class MetadataInjectorServiceProvider {

    /**
     *
     * @param {Container} container
     * @param {Fusion} fusion
     */
    constructor(container, fusion) {
        this.container = container;
        this.fusion    = fusion;
    }

    /**
     *
     */
    register() {
        let metaInjector = new MetaInjector(this.container);

        this.container.value('meta-inject', metaInjector);
        this.fusion.getByManifest('meta-injector').
        forEach(Symbol => metaInjector.inject(Symbol));
    }
}
