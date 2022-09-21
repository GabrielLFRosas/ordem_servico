
exports.up = function(knex) {
    return knex.schema.createTable('services', table => {
        table.increments('id').primary()
        table.string('title').notNull()
    })
};


exports.down = function(knex) {
  
};
