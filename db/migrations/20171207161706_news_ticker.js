
exports.up = function(knex, Promise) {
    return knex.schema.createTable('news_ticker', function(table){
        table.increments();

        table.text('url').nullable();
        table.string('source_id').nullable();
        table.string('source_name').nullable();
        table.string('author').notNullable().index();
        table.string('title').notNullable().index();
        table.text('description').nullable();
        table.text('img_url').nullable();
        table.timestamp('published_at').notNullable();

        table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("news_ticker");
};
