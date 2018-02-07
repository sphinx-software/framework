import TestSuite from "WaveFunction/TestSuite";
import fusion from "Fusion/Fusion";
import Container from "@sphinx-software/container";
import {EventEmitter} from "events";

export default class FusionTestSuite extends TestSuite {

    /**
     * @type {Container}
     */
    container = new Container(new EventEmitter());

    /**
     * @type {Fusion}
     */
    fusion    = fusion;

    /**
     * @private
     * @param context
     * @return {Promise<void>}
     */
    async before(context) {

        await this.fusionLoading(context);

        fusion.use(this.manifest());

        await this.fusionLoaded(context);

        await this.fusionActivating(context);

        this.container = await fusion.activate(
            this.config(),
            this.container,
            () => this.fusionRegistered(context),
            () => this.fusionBooted(context)
        );

        await this.fusionActivated(context);
    }

    /**
     * Replace a service with the mocked one
     *
     * @protected
     * @param ServiceInterface
     * @param callbackFunction
     * @return {Promise<FusionTestSuite>}
     */
    async mock(ServiceInterface, callbackFunction) {

        let real    = await this.container.make(ServiceInterface);
        let mocked  = await callbackFunction(real);

        this.container.value(ServiceInterface, mocked);

        return this;
    }

    /**
     * Hook before fusion load
     *
     * @protected
     * @param context
     * @return {Promise<void>}
     */
    async fusionLoading(context) {

    }

    /**
     * Hook after fusion load
     *
     * @protected
     * @param context
     * @return {Promise<void>}
     */
    async fusionLoaded(context) {

    }

    /**
     * Hook before fusion activate
     *
     * @protected
     * @param context
     * @return {Promise<void>}
     */
    async fusionActivating(context) {

    }

    /**
     * Hook when service providers are registered
     *
     * @protected
     * @param context
     * @return {Promise<void>}
     */
    async fusionRegistered(context) {

    }

    /**
     * Hook when service providers are booted
     *
     * @protected
     * @param context
     * @return {Promise<void>}
     */
    async fusionBooted(context) {

    }

    /**
     * Hook after fusion activate
     *
     * @protected
     * @param context
     * @return {Promise<void>}
     */
    async fusionActivated(context) {

    }

    /**
     * Get the configuration value
     *
     * @abstract
     * @protected
     * @return {{}}
     */
    config() {
        return {};
    }

    /**
     * Get the list of modules that should be load
     *
     * @abstract
     * @protected
     * @return {{}}
     */
    manifest() {
        return {};
    }
}
