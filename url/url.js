/**
 * URL Helper. This will generate fully-qualified url
 */
class Url {

    /**
     *
     * @param {router} router
     */
    constructor(router) {
        this.router = router;
    }

    /**
     * Set the asset path
     *
     * @param {string} assetPath
     * @return {Url}
     */
    setAssetsPath(assetPath) {
        this.assetPath = assetPath;
        return this;
    }

    /**
     * Set the application host (domain name)
     *
     * @param {host} host
     * @return {Url}
     */
    setHost(host) {
        this.host = host;
        return this;
    }

    /**
     * Tell the application is using https or not
     *
     * @param {boolean} isSecure
     * @return {Url}
     */
    secure(isSecure) {
        this.isSecure = isSecure;
        return this;
    }

    /**
     * Generate back the route's url from its name
     *
     * @param {string} name The route name
     * @param {{}} parameters
     * @return {string}
     */
    route(name, parameters) {
        return this.generateLink(this.router.url(name, parameters));
    }

    /**
     * Calculate an absolute url by the path pattern. (With the current configured host)
     *
     * @param {string} pathPattern
     * @param {{}} parameters
     * @return {string}
     */
    absolute(pathPattern, parameters) {
        return this.generateLink(this.router.constructor.url(pathPattern, parameters));
    }

    /**
     * Calculate a fully qualified url by the path pattern
     *
     * @param pathPattern
     * @param parameters
     * @return {*}
     */
    fullyQualified(pathPattern, parameters) {
        return this.router.constructor.url(pathPattern, parameters);
    }

    /**
     * Generate a path to the assets
     *
     * @param {string} fileURL
     * @return {string}
     */
    asset(fileURL) {
        return this.generateLink(this.assetPath + fileURL);
    }

    /**
     *
     * @param path
     * @return {string}
     */
    generateLink(path) {
        return this.isSecure ? 'https' : 'http' + '://' + this.host + path;
    }
}

module.exports = Url;
