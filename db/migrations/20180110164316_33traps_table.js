
exports.up = function(knex, Promise) {
    return knex.schema.createTable('33traps', function(table){
        table.increments();

        table.string('nickname').notNullable();
        table.integer('record').notNullable();

        table.timestamp('updated_at').notNullable().defaultTo(knex.raw('now()'));
        table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()')).index();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("33traps");
};
