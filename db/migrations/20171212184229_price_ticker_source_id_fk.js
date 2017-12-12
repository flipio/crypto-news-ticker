
exports.up = function(knex, Promise) {
    return knex.schema.table('price_ticker', function(table) {
        table.bigInteger('source_id').unsigned().index().references('id').inTable('source').alter();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('price_ticker', function(table) {
        table.string('source').nullable();
    });
};
