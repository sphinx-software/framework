exports.NullStorageAdapter       = require('./null');
exports.MemoryStorageAdapter     = require('./memory/memory-storage-adapter');
exports.FilesystemStorageAdapter = require('./filesystem/filesystem-storage-adapter');
exports.DatabaseStorageAdapter   = require('./database/database-storage-adapter');
exports.MongoStorageAdapter      = require('./mongo/mongo-storage-adapter');