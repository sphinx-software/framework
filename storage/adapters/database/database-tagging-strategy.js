class DatabaseTaggingStrategy {

    generateTagsField(tags) {
        return '|' + tags.join('|') + '|';
    }

    generateTagQuery(tag, query) {
        return query.where('tags', 'like', `%|${tag}|%`);
    }

}

module.exports = DatabaseTaggingStrategy;