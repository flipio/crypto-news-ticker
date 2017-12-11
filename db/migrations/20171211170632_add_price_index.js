
exports.up = function(knex, Promise) {
    return knex.schema.table('price_ticker', function(t) {
        t.index([ 'price' ]);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('price_ticker', function(t) {
        t.dropIndex([ 'price' ]);
    });
};
