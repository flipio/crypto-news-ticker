
exports.up = function(knex, Promise) {
    return knex.schema.table('price_ticker', function(table) {
        table.renameColumn('source', 'source_id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('price_ticker', function(table) {
        table.renameColumn('source_id', 'source');
    });
};
