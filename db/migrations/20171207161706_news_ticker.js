
exports.up = function(knex, Promise) {
    return knex.schema.createTable('news_ticker', function(table){
        table.increments();

        table.string('url').nullable();
        table.string('source_id').nullable();
        table.string('source_name').nullable();
        table.string('author').nullable();
        table.string('title');
        table.string('description').nullable();
        table.string('img_url').nullable();
        table.string('published_at');

        table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("news_ticker");
};
