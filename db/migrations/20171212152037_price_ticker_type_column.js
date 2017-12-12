
exports.up = function(knex, Promise) {
    return knex.schema.table('price_ticker', function(table) {
        table.string('type').nullable();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('price_ticker', function(table) {
        table.dropColumn('type')
    });
};
