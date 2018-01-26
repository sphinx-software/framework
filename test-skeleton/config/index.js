export default  {

    modules: [
        // Frameworks Module
        './../Http',
        './../Hash',
        './../MetaInjector',
        './../storage',

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
    }
};
