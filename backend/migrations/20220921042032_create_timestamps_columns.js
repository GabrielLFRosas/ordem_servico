
exports.up = function(knex) {
    return knex.schema.table('users', table => {
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
        table.timestamp('deletedAt');
    })
};

exports.down = function(knex) {
  
};
