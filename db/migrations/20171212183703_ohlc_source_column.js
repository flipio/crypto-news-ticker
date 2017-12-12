
exports.up = function(knex, Promise) {
    return knex.schema.table('ohlc_ticker', function(table) {
        table.bigInteger('source_id').unsigned().index().references('id').inTable('source');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('ohlc_ticker', function(table) {
        table.dropColumn('source_id');
    });
};
