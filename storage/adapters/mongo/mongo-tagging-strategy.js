class MongoTaggingStrategy {

    queryForTag(tag, spec) {
        return spec['tags'] = {
            $elemMatch: { $eq: tag }
        };
    }

    generateTagsField(tags) {
        return tags;
    }
}

module.exports = MongoTaggingStrategy;