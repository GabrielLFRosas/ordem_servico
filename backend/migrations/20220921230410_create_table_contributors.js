exports.up = function(knex) {
    return knex.schema.createTable('contributors', table => {
        table.increments('id').primary()
        table.integer('userId').references('id')
                                .inTable('users')
        table.timestamp('firedAt')
    })
};


exports.down = function(knex) {
  
};
