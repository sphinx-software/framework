export default  {

    modules: [
        // Frameworks Module
        './../Http',
        './../MetaInjector',

        // Application Module
        'Http'
    ],

    http: {
        port: process.env.HTTP_PORT || 8800
    }
};
