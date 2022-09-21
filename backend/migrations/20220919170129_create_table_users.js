
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('email').notNull().unique()
        table.string('number').notNull()
        table.string('identity').notNull().unique()
        table.string('password').notNull()
        table.boolean('contributor').notNull().defaultTo(false)
        table.boolean('admin').notNull().defaultTo(false)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
