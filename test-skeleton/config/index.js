export default  {

    modules: [
        // Frameworks Module
        './../Http',
        './../Hash',
        './../MetaInjector',
        './../storage',
        './../mail',

        // Application Module
        'Http'
    ],

    http: {
        port: process.env.HTTP_PORT || 8800,
        middlewares: [

        ]
    },

    hash: {
        rounds: 10
    },

    mail: {
        'default': process.env.MAIL_TRANSPORT || 'development',

        transports: {

            // This is just for the development purpose.
            // The mailer will log the email to the log file instead of
            // sending it.
            development: {
                service: 'log'
            },

            google : {

                // For more transport configuration, see: https://nodemailer.com
                service: 'gmail',
                auth: {
                    user: process.env.MAIL_GOOGLE_USERNAME || 'test1@sphinx-software.com',
                    pass: process.env.MAIL_GOOGLE_PASSWORD || 'hackduocthidung'
                }
            },

            // Add more mail transport if needed here
        },

        // The default options for mail. See https://nodemailer.com for more options
        options: {
            from: process.env.MAIL_FROM || 'noreply@sphinx-software.com',
            subject: 'Test mailer'
        }
    }
};
