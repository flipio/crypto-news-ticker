
exports.up = function(knex, Promise) {
    return knex.schema.createTable('price_ticker', function(table){
        table.increments();

        table.float('price').notNullable().defaultTo(0);
        table.float('close_price').notNullable().defaultTo(0);
        table.float('close_price_volume').notNullable().defaultTo(0);
        table.float('ask_price').notNullable().defaultTo(0);
        table.float('bid_price').notNullable().defaultTo(0);
        table.float('open_price').notNullable().defaultTo(0);
        table.float('spread').notNullable().defaultTo(0);
        table.string('source').nullable();

        table.timestamp('time').notNullable().defaultTo(knex.raw('now()')).index();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("price_ticker");
};
