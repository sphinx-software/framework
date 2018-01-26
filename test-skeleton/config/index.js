export default  {

    modules: [
        // Frameworks Module
        './../Http',
        './../MetaInjector',
        './../storage',

        // Application Module
        'Http'
    ],

    http: {
        port: process.env.HTTP_PORT || 8800
    }
};
