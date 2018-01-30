const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./mydb.sqlite"
    }
});


console.log(knex('table1').where({id: 1}).toSQL());


const handler = {
    apply: (knex, thisArg, args) => {
        let tableName = args[0];
        return knex('some_prefix_' + tableName);
    },

    get: (knex, prop) => {
        if(prop === 'from') {
            return (tableName) => knex.from('other_prefix_' + tableName);
        } else {
            return knex[prop];
        }
    }
};


let knexWrapper = new Proxy(knex, handler);


