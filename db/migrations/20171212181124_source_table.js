
exports.up = function(knex, Promise) {
    return knex.schema.createTable('source', function(table){
        table.increments();

        table.string('name').nullable();
        table.string('url').notNullable();

        table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()')).index();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("source");
};
