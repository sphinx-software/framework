class KnexExtension {
    tablename(tablename) {
        return 'fusion_' + tablename;
    }
}

upgrade = (knex, extension) => {


    return new Proxy(knex, {
        /// todo
    })
};


const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./mydb.sqlite"
    }
});

// console.log(knex().toSQL());


let upgradeQuery = upgrade(knex(), new KnexExtension());


let q = upgradeQuery();

console.log(q === knex);


/// Using proxy for upgrading knex