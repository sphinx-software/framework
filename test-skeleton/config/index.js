import 'winston-daily-rotate-file';
import winston from 'winston';
import path    from 'path';
import cache   from './cache';

export default {

    modules: [
        // Frameworks Module
        './../Http',
        './../Serializer',
        './../Hash',
        './../Log',
        './../MetaInjector',
        './../View',
        './../Storage',
        './../Cache',

        // Application Module
        'Http'
    ],

    http: {
        port       : process.env.HTTP_PORT || 8800,
        middlewares: []
    },
    cache,
    hash: {
        rounds: 10
    },

    log: {
        transports: [

            // File rotate logger
            new winston.transports.DailyRotateFile({
                filename   : path.normalize(
                    `${__dirname}/../storages/logs/sphinx--`),
                datePattern: 'yyyy-MM-dd.log',
                level      : 'debug'
            }),

            // Error logger
            new winston.transports.File({
                filename: path.normalize(
                    `${__dirname}/../storages/logs/error.log`),
                level   : 'error'
            })
        ],

        level: process.env.LOG_LEVEL || 'debug'
    },

    view: {
        directory: path.normalize(path.join(__dirname, '..', 'resources', 'views')),
    }
};

