class SphinxLoader {
    constructor(nunjuckFileSystemLoader) {
        this.loader = nunjuckFileSystemLoader;
        this.extension = 'njk.html';
    }

    getSource(temlateName) {
        return this.loader.getSource(this.resolveFileName(temlateName));
    }

    setExtension(extension) {
        this.extension = extension;
        return this;
    }

    resolveFileName(templateName) {
        return templateName.endsWith('.' + this.extension) ? templateName : templateName + '.' + this.extension;
    }
}

module.exports = SphinxLoader;
