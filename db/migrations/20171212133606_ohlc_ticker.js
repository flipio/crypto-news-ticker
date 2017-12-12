

exports.up = function(knex, Promise) {
    return knex.schema.createTable('ohlc_ticker', function(table){
        table.increments();

        table.float('open_price').notNullable().defaultTo(0);
        table.float('close_price').notNullable().defaultTo(0);
        table.float('volume').notNullable().defaultTo(0);
        table.float('high_price').notNullable().defaultTo(0);
        table.float('low_price').notNullable().defaultTo(0);
        table.float('volume_weighted_average_price').notNullable().defaultTo(0);
        table.integer('count').notNullable().defaultTo(0);
        table.string('type').nullable();
        table.timestamp('time').notNullable().unique().index();

        table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("ohlc_ticker");
};
